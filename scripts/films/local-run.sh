#!/usr/bin/env bash
#
# The film pipeline on this computer, for local development: the same steps as
# .github/workflows/prepare-film.yml, but the files go to public/films/ (gitignored) and are served
# by the local site instead of R2. A local admin with no FILMS_GITHUB_TOKEN starts this itself.
#
# Env: DRIVE_ID, START, FILM_KEY, FILMS_CALLBACK (the admin's /api/films), FILMS_SECRET.
# Downloads with GOOGLE_SERVICE_ACCOUNT when set; otherwise the file must be shared as
# "Anyone with the link". Needs ffmpeg and ffprobe.

set -uo pipefail
here=$(cd "$(dirname "$0")" && pwd)
site=$(cd "$here/../.." && pwd)
work=$(mktemp -d)
export FILM_ERROR_FILE="$work/error.txt"
version=$(date +%s)
rel="films/${FILM_KEY/@/-at-}/$version"
export FILM_OUT="$site/public/$rel"
export FILM_BASE="/$rel"

failed() { node "$here/callback.mjs" failed; rm -rf "$work"; exit 1; }

command -v ffmpeg >/dev/null || { echo "ffmpeg is not installed on this computer (brew install ffmpeg)." > "$FILM_ERROR_FILE"; failed; }

echo "Downloading $DRIVE_ID"
if [[ -n "${GOOGLE_SERVICE_ACCOUNT:-}" ]]; then
  node "$here/drive-download.mjs" "$DRIVE_ID" "$work/source" || failed
else
  curl -fsSL "https://drive.usercontent.google.com/download?id=$DRIVE_ID&export=download&confirm=t" -o "$work/source" \
    || { echo "Could not download the film. Share it as “Anyone with the link” (or set GOOGLE_SERVICE_ACCOUNT)." > "$FILM_ERROR_FILE"; failed; }
  if file -b --mime-type "$work/source" | grep -q '^text/'; then
    echo "Drive sent a web page, not the film. Share it as “Anyone with the link” and try again." > "$FILM_ERROR_FILE"; failed
  fi
fi

bash "$here/encode.sh" "$work/source" "${START:-0}" "$FILM_OUT" || { rm -rf "$FILM_OUT"; failed; }
node "$here/callback.mjs" live || failed
rm -f "$FILM_OUT/meta.json"
rm -rf "$work"
echo "Live at $FILM_BASE"
