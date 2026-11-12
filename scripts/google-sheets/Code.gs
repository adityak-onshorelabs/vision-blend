/**
 * Vision Blend website: form submissions to this Google Sheet.
 *
 * The site (src/lib/sheets.ts) posts each enquiry here as JSON. This script appends it as a row on
 * the form's tab (Enquiries, Portfolio access, Partners, Careers), creating the tab and its header
 * row the first time, and adding a column if a form gains a field. A careers CV is saved to a Drive
 * folder next to this sheet, and the row gets a link to it.
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
    if (!body.tab || !body.row || !body.row.length) return reply({ ok: false, error: "empty" });

    var row = body.row.slice();
    if (body.file && body.file.base64) row.push(["CV", saveFile(body.file)]);

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      append(body.tab, row);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
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
  return folder.createFile(blob).getUrl();
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
