#!/usr/bin/env bash
#
# Film pipeline, step 2: cut the showcase loop.
#
#   bash scripts/films/encode.sh <source-film> <start-seconds> <output-dir>
#
# Writes, into <output-dir>:
#   <size>.mp4   a 12-second muted H.264 loop per size, where size is the short side in px:
#                720, 1080 and 2160, never upscaled (a small source gets fewer sizes; a source
#                between sizes, like a 1600 px scope master, also keeps its own size on top)
#   poster.jpg   the loop's first frame, from the rendition closest to 1080
#   meta.json    {"sizes": [...], "width": W, "height": H}, the frame as displayed
#
# Phone footage with a rotation flag comes out upright (ffmpeg rotates before the scale filter,
# which sizes by the short side whatever the orientation). On failure, a sentence the admin can
# show the client goes to FILM_ERROR_FILE.

set -euo pipefail

LOOP_SECONDS=12
LADDER=(720 1080 2160)

fail() {
  [[ -n "${FILM_ERROR_FILE:-}" ]] && printf '%s' "$1" > "$FILM_ERROR_FILE"
  echo "::error::$1" >&2
  exit 1
}

src=${1:?source film}
start=${2:-0}
out=${3:?output dir}
mkdir -p "$out"

[[ "$start" =~ ^[0-9]+$ ]] || fail "The loop's start time must be whole seconds."

probe() { ffprobe -v error -select_streams v:0 -show_entries "$1" -of default=nw=1:nk=1 "$2" | head -n1; }

width=$(probe stream=width "$src") || true
height=$(probe stream=height "$src") || true
[[ "$width" =~ ^[0-9]+$ && "$height" =~ ^[0-9]+$ ]] || fail "The Drive file has no video ffmpeg can read. Export it as MP4 or MOV and try again."
duration=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$src" | cut -d. -f1)
if [[ "$duration" =~ ^[0-9]+$ ]] && (( start >= duration )); then
  fail "The film is ${duration} seconds long, so the loop can't start at ${start} seconds."
fi

short=$(( width < height ? width : height ))
sizes=()
for s in "${LADDER[@]}"; do
  # 5% slack, so a 1072 px master still counts as 1080
  (( s * 100 <= short * 105 )) && sizes+=("$s")
done
if (( ${#sizes[@]} == 0 )); then
  sizes=($(( short / 2 * 2 )))
elif (( short * 10 > ${sizes[${#sizes[@]}-1]} * 12 )); then
  sizes+=($(( short / 2 * 2 )))
fi
echo "Source ${width}x${height}, ${duration:-?}s; sizes: ${sizes[*]}"

for s in "${sizes[@]}"; do
  if   (( s <= 720 ));  then crf=23; max=3M
  elif (( s <= 1080 )); then crf=22; max=6M
  else                       crf=21; max=16M
  fi
  # Bitrate cap at twice the buffer keeps a busy shot from ballooning the file
  ffmpeg -nostdin -hide_banner -loglevel error -y \
    -ss "$start" -t "$LOOP_SECONDS" -i "$src" \
    -map 0:v:0 -an -sn -dn -map_metadata -1 \
    -vf "scale='if(gte(iw,ih),-2,$s)':'if(gte(iw,ih),$s,-2)':flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf "$crf" -maxrate "$max" -bufsize "$max" -profile:v high \
    -movflags +faststart -tag:v avc1 \
    "$out/$s.mp4" || fail "ffmpeg could not convert the film (size $s)."
  [[ -s "$out/$s.mp4" ]] || fail "ffmpeg produced an empty file (size $s)."
  echo "  $s.mp4  $(du -h "$out/$s.mp4" | cut -f1)"
done

# Poster from the rendition closest to 1080 (the largest at or under it, else the smallest)
poster=${sizes[0]}
for s in "${sizes[@]}"; do (( s <= 1080 )) && poster=$s; done
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$out/$poster.mp4" -frames:v 1 -q:v 3 "$out/poster.jpg" \
  || fail "ffmpeg could not take the poster frame."

# The frame as displayed (after rotation), from the largest rendition
top=${sizes[${#sizes[@]}-1]}
w=$(probe stream=width "$out/$top.mp4")
h=$(probe stream=height "$out/$top.mp4")
printf '{"sizes":[%s],"width":%s,"height":%s}\n' "$(IFS=,; echo "${sizes[*]}")" "$w" "$h" > "$out/meta.json"
cat "$out/meta.json"
