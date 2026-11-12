/*
  Film pipeline, last step: tell the admin how the run went.

    node scripts/films/callback.mjs live     (after a successful upload)
    node scripts/films/callback.mjs failed   (when any step failed)

  POSTs to FILMS_CALLBACK (the admin's /api/films) with `Authorization: Bearer FILMS_SECRET`.
  The admin records it and refreshes the site, so a live film shows on the next visit.
*/
import { existsSync, readFileSync } from "node:fs";

const status = process.argv[2];
const { FILMS_CALLBACK, FILMS_SECRET, FILM_KEY, FILM_BASE, FILM_OUT, FILM_ERROR_FILE, GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;

if (!["live", "failed"].includes(status)) throw new Error("Usage: callback.mjs live|failed");
if (!FILMS_CALLBACK || !FILMS_SECRET) {
  console.error("::error::FILMS_SECRET is not set, so the admin can't be told how the run went.");
  process.exit(1);
}

const body = { key: FILM_KEY, status };
// Absent when the pipeline runs locally (local-run.sh)
if (GITHUB_RUN_ID) body.run = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
if (status === "live") {
  Object.assign(body, JSON.parse(readFileSync(`${FILM_OUT}/meta.json`, "utf8")), { base: FILM_BASE });
} else {
  const written = FILM_ERROR_FILE && existsSync(FILM_ERROR_FILE) ? readFileSync(FILM_ERROR_FILE, "utf8").trim() : "";
  body.error = written || "The film could not be prepared. The run's log on GitHub says why.";
}

const res = await fetch(FILMS_CALLBACK, {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${FILMS_SECRET}` },
  body: JSON.stringify(body),
});
if (!res.ok) {
  console.error(`::error::The admin answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
console.log(`Admin told: ${status}`);
