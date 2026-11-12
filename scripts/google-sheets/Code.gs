/**
 * Vision Blend website: form submissions to this Google Sheet.
 *
 * The site (src/lib/sheets.ts) posts each enquiry here as JSON. This script appends it as a row on
 * the form's tab (Enquiries, Portfolio access, Partners, Careers), creating the tab and its header
 * row the first time, and adding a column if a form gains a field. A careers CV is saved to a Drive
 * folder next to this sheet, and the row gets a link to it.
 *
 * Email notice (body.notify): Careers applications are emailed to HR from here, with the
 * applicant's details, the CV attached and its Drive link (the site sends notify only while its own
 * email delivery, Resend, is not set up). The mail goes out from the account that owns this script,
 * so after updating the script, authorise the new "send email" permission when asked.
 *
 * Returning leads (action "industry"): when someone who already enquired opens another industry's
 * portfolio, the site sends their email and the industry. The script finds their latest row (on
 * Portfolio access, then Enquiries) and adds the industry to its "Industries explored" column, so
 * one person stays one lead. With no matching row it appends the fallback row instead.
 *
 * Setup (once):
 *  1. Open the sheet > Extensions > Apps Script. Replace Code.gs with this file and save.
 *  2. Project Settings (gear) > Script properties > add SECRET with a long random value.
 *  3. Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone.
 *     Authorise when asked, then copy the Web app URL (ends in /exec).
 *  4. In Vercel (and .env.local): SHEETS_WEBHOOK_URL = that URL, SHEETS_WEBHOOK_SECRET = the SECRET.
 *     Redeploy the site.
 * After editing this script: Deploy > Manage deployments > edit > Version: New version, so the
 * same URL keeps working.
 */

var CV_FOLDER = "Vision Blend website CVs";

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || body.secret !== secret) return reply({ ok: false, error: "unauthorised" });
    if (body.action === "industry") return reply(withLock(function () { return addIndustry(body); }));
    if (!body.tab || !body.row || !body.row.length) return reply({ ok: false, error: "empty" });

    var row = body.row.slice();
    var cv = null;
    if (body.file && body.file.base64) {
      cv = saveFile(body.file);
      row.push(["CV", cv.getUrl()]);
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      append(body.tab, row);
    } finally {
      lock.releaseLock();
    }
    // The row is saved; a failed notice is reported but does not undo it
    var mailed = body.notify ? notify(body.notify, row, cv) : null;
    return reply({ ok: true, mailed: mailed });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function withLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

/** Adds an industry to the lead's latest row; appends the fallback row when there is none */
function addIndustry(body) {
  var email = String(body.email || "").trim().toLowerCase();
  var industry = String(body.industry || "").trim();
  if (!email || !industry) return { ok: false, error: "empty" };
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var tabs = body.tabs || [];
  for (var t = 0; t < tabs.length; t++) {
    var sheet = book.getSheetByName(tabs[t]);
    if (!sheet || sheet.getLastRow() < 2) continue;
    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var emailCol = headers.indexOf("Email");
    if (emailCol === -1) continue;
    var emails = sheet.getRange(2, emailCol + 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = emails.length - 1; i >= 0; i--) {
      if (String(emails[i][0]).trim().toLowerCase() !== email) continue;
      var row = i + 2;
      var colOf = function (name) {
        var c = headers.indexOf(name);
        if (c === -1) {
          headers.push(name);
          c = headers.length - 1;
          sheet.getRange(1, c + 1).setValue(name).setFontWeight("bold");
        }
        return c + 1;
      };
      var firstCol = headers.indexOf("Industry");
      var first = firstCol === -1 ? "" : String(sheet.getRange(row, firstCol + 1).getValue()).trim();
      var cell = sheet.getRange(row, colOf("Industries explored"));
      var list = String(cell.getValue() || "").split(",").map(function (s) { return s.trim(); }).filter(String);
      if (first !== industry && list.indexOf(industry) === -1) {
        list.push(industry);
        cell.setValue(list.join(", "));
        sheet.getRange(row, colOf("Last visit")).setValue(clean(body.when));
      }
      return { ok: true, matched: true };
    }
  }
  if (!body.fallback) return { ok: false, error: "no lead" };
  append(body.fallback.tab, body.fallback.row.concat([["Industries explored", industry], ["Note", "Returning visitor"]]));
  return { ok: true, matched: false };
}

/** For checking the deployment in a browser */
function doGet() {
  return reply({ ok: true, service: "vision-blend-forms" });
}

function append(tabName, pairs) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(tabName) || book.insertSheet(tabName);
  var lastCol = sheet.getLastColumn();
  var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  // New fields get a new column at the end, so old rows keep their place
  var added = false;
  pairs.forEach(function (p) {
    if (headers.indexOf(p[0]) === -1) {
      headers.push(p[0]);
      added = true;
    }
  });
  if (added) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  var values = headers.map(function (h) {
    for (var i = 0; i < pairs.length; i++) if (pairs[i][0] === h) return clean(pairs[i][1]);
    return "";
  });
  sheet.appendRow(values);
}

/** Text a spreadsheet will not read as a formula; phone numbers keep their + and leading zeros */
function clean(v) {
  var s = v == null ? "" : String(v);
  return /^[=+\-@0]/.test(s) ? "'" + s : s;
}

function saveFile(file) {
  var folders = DriveApp.getFoldersByName(CV_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CV_FOLDER);
  var blob = Utilities.newBlob(Utilities.base64Decode(file.base64), file.type, file.name);
  return folder.createFile(blob);
}

/** Emails the saved row (and the CV, attached) to body.notify.to; true once sent */
function notify(n, pairs, cv) {
  try {
    var html = '<table cellpadding="6" style="font-family:sans-serif;font-size:14px">' +
      pairs.filter(function (p) { return p[1]; }).map(function (p) {
        var v = escapeHtml(p[1]).replace(/\n/g, "<br>");
        if (p[0] === "CV" || /^https?:\/\//.test(String(p[1]))) v = '<a href="' + escapeHtml(p[1]) + '">' + v + "</a>";
        return '<tr><td style="color:#6f6a66;vertical-align:top">' + escapeHtml(p[0]) + "</td><td>" + v + "</td></tr>";
      }).join("") + "</table>";
    var options = { to: n.to, subject: n.subject, htmlBody: html, name: "Vision Blend website" };
    if (n.replyTo) options.replyTo = n.replyTo;
    if (cv) options.attachments = [cv.getBlob()];
    MailApp.sendEmail(options);
    return true;
  } catch (err) {
    console.error("notify failed: " + err);
    return false;
  }
}

function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
