/*
  Film pipeline, step 1: download the client's film from Google Drive.

    node scripts/films/drive-download.mjs <drive-file-id> <output-path>

  Signs in as the pipeline's own Google service account (GOOGLE_SERVICE_ACCOUNT, the account's JSON
  key). The client shares the film, or the folder it is in, with that account's email once; nothing
  needs to be public. Uses only Node's built-ins, so the run installs nothing.

  On failure, a sentence the admin can show the client goes to FILM_ERROR_FILE.
*/
import { createSign } from "node:crypto";
import { createWriteStream, writeFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

/** The runner has about 14 GB of disk; the source and its renditions must both fit */
const MAX_BYTES = 8 * 1024 ** 3;

function fail(message) {
  if (process.env.FILM_ERROR_FILE) writeFileSync(process.env.FILM_ERROR_FILE, message);
  console.error(`::error::${message}`);
  process.exit(1);
}

const [fileId, out] = process.argv.slice(2);
if (!fileId || !out) fail("Usage: drive-download.mjs <drive-file-id> <output-path>");

let account;
try {
  account = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT ?? "");
} catch {
  fail("The pipeline's Google account is not set up (GOOGLE_SERVICE_ACCOUNT secret).");
}

/** OAuth access token for the service account (JWT bearer grant), read-only Drive scope */
async function accessToken() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const aud = account.token_uri ?? "https://oauth2.googleapis.com/token";
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(account.private_key, "base64url");
  const res = await fetch(aud, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) fail(`Google refused the pipeline's sign-in (${res.status}). The service account key may have been revoked.`);
  return (await res.json()).access_token;
}

const token = await accessToken();
const api = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`;
const auth = { authorization: `Bearer ${token}` };

const meta = await fetch(`${api}?fields=name,mimeType,size&supportsAllDrives=true`, { headers: auth });
if (meta.status === 404) {
  fail(`The pipeline can't see this Drive file. Share it (or its folder) with ${account.client_email} as Viewer, then try again.`);
}
if (!meta.ok) fail(`Drive answered ${meta.status} when asked about the file.`);
const { name, mimeType, size } = await meta.json();
if (!mimeType?.startsWith("video/")) fail(`“${name}” is not a video file (Drive says ${mimeType}).`);
if (Number(size) > MAX_BYTES) fail(`“${name}” is ${(Number(size) / 1024 ** 3).toFixed(1)} GB; the pipeline takes films up to 8 GB. Export a smaller master.`);
console.log(`Downloading “${name}” (${mimeType}, ${(Number(size) / 1024 ** 2).toFixed(0)} MB)`);

const file = await fetch(`${api}?alt=media&supportsAllDrives=true`, { headers: auth });
if (!file.ok || !file.body) fail(`Drive answered ${file.status} when downloading “${name}”.`);
await pipeline(Readable.fromWeb(file.body), createWriteStream(out));
console.log("Downloaded");
