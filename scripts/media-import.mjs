#!/usr/bin/env node
/*
  Brings the studio's portfolio files from Google Drive onto ImageKit, ready for the site.

    npm run media:import -- --industry <slug> <drive link or local file>... [options]

  For each file:
    1. Downloads it from Drive (the file must be shared "anyone with the link"), or takes a local
       path for a private file you downloaded yourself.
    2. Reads its size, resolution and bitrate, and warns when it is below 1080p (it will look soft;
       ask the studio for a 1080p export).
    3. Videos: keeps the studio's encode untouched where possible (only moved to fast-start, so it
       begins playing before it has fully loaded). Anything wider or taller than 1920 is scaled to
       1920. Anything still over ImageKit's 100 MB upload cap is re-encoded (H.264, 2-pass, slow) at
       the highest bitrate that fits.
    4. Films: saves a card frame, 1 s in, to public/images/work/<industry>/<name>.jpg.
    5. With --loop-at <seconds> (one video only): cuts the 12-second muted loop for an industry-page
       card, uploaded to videos/<industry>/<name>.mp4 with its first frame as <name>.jpg.
    6. Uploads to ImageKit under work/<industry>/, inside the folder NEXT_PUBLIC_MEDIA_URL points at.
       Existing files are never replaced unless --overwrite; a new name is safer anyway, because
       the CDN may keep serving the old file under the old name.
    7. Prints the lines to paste into src/content/hosted-work.ts (and, for a loop, the card fields
       for src/content/industry-details.ts).

  Nothing here uses ImageKit's video processing units: the site plays each upload as is
  (src/lib/stream.ts), so all encoding happens on this machine.

  Options
    --industry <slug>      Required. real-estate, d2c, hospitality-services or automobile.
    --name <slug>          File name on ImageKit (one input only). Default: from the Drive file name.
    --drive <link or id>   For a local file: the Drive file it came from, so the printed lines are
                           keyed by its id (the site looks pieces up by Drive id).
    --loop-at <seconds>    Also cut a 12 s loop starting here (one video only).
    --loop-crop <w:h:x:y>  Crop for the loop, e.g. to drop letterbox bars (ffmpeg crop syntax).
    --overwrite            Replace files that already exist on ImageKit.
    --dry-run              Download and prepare, but upload nothing.

  Needs: Node 20+, ffmpeg and ffprobe (on PATH, or FFMPEG_PATH / FFPROBE_PATH), and in .env.local:
  NEXT_PUBLIC_MEDIA_URL and IMAGEKIT_PRIVATE_KEY (never commit or deploy the private key).
*/
import { spawnSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, openAsBlob, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { parseArgs } from "node:util";

const ROOT = resolve(import.meta.dirname, "..");
const UPLOAD_CAP = 95e6; // ImageKit's limit is 100 MB (104857600 B); leave room for the container
const MAX_EDGE = 1920;
const LOOP_SECONDS = 12;
const VIDEO = new Set([".mp4", ".mov", ".m4v", ".webm", ".mkv"]);
const IMAGE = new Set([".png", ".jpg", ".jpeg", ".webp"]);

/* ---------- setup ---------- */

const { values: opt, positionals: inputs } = parseArgs({
  allowPositionals: true,
  options: {
    industry: { type: "string" },
    name: { type: "string" },
    drive: { type: "string" },
    "loop-at": { type: "string" },
    "loop-crop": { type: "string" },
    overwrite: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (opt.help || !inputs.length) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^#!.*\n\/\*\n?/, ""));
  process.exit(opt.help ? 0 : 1);
}
const fail = (msg) => {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
};
if (!opt.industry || !/^[a-z0-9-]+$/.test(opt.industry)) fail("Pass --industry <slug>, e.g. --industry real-estate");
if ((opt.name || opt.drive || opt["loop-at"]) && inputs.length > 1) fail("--name, --drive and --loop-at take one input at a time");
if (opt.drive) opt.drive = driveId(opt.drive) ?? fail("--drive takes a Drive file link or id");

const env = Object.fromEntries(
  (existsSync(join(ROOT, ".env.local")) ? readFileSync(join(ROOT, ".env.local"), "utf8") : "")
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);
const MEDIA_URL = (process.env.NEXT_PUBLIC_MEDIA_URL ?? env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");
const KEY = process.env.IMAGEKIT_PRIVATE_KEY ?? env.IMAGEKIT_PRIVATE_KEY;
const endpoint = MEDIA_URL.match(/^https:\/\/ik\.imagekit\.io\/[^/]+(\/.*)?$/);
if (!endpoint) fail("NEXT_PUBLIC_MEDIA_URL in .env.local must be the ImageKit URL endpoint, e.g. https://ik.imagekit.io/<id>/<folder>");
if (!KEY && !opt["dry-run"]) fail("IMAGEKIT_PRIVATE_KEY is missing from .env.local (needed to upload)");
const IK_ROOT = endpoint[1] ?? ""; // media library folder the site reads from, e.g. /Onshorelabs/vision-blend

function findTool(name, envVar) {
  const candidates = [process.env[envVar], name];
  for (const c of candidates.filter(Boolean)) {
    if (spawnSync(c, ["-version"], { stdio: "ignore" }).status === 0) return c;
  }
  fail(`${name} not found. Install it (Windows: winget install Gyan.FFmpeg; macOS: brew install ffmpeg) or set ${envVar}.`);
}
const FFMPEG = findTool("ffmpeg", "FFMPEG_PATH");
const FFPROBE = findTool("ffprobe", "FFPROBE_PATH");

const WORK = join(tmpdir(), "vb-media-import");
mkdirSync(WORK, { recursive: true });

/* ---------- helpers ---------- */

const run = (bin, args) => {
  const r = spawnSync(bin, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) fail(`${basename(bin)} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
};
const ff = (args) => run(FFMPEG, ["-y", "-v", "error", ...args]);
const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;
const slugify = (s) =>
  s
    .replace(/\.[^.]+$/, "")
    .replace(/^copy of /i, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");

/** Drive file id from any Drive file link, or null for a local path */
function driveId(s) {
  return s.match(/\/d\/([\w-]{20,})/)?.[1] ?? s.match(/[?&]id=([\w-]{20,})/)?.[1] ?? (/^[\w-]{25,}$/.test(s) && !existsSync(s) ? s : null);
}

async function download(id) {
  const res = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`, { redirect: "follow" });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || type.includes("text/html")) {
    fail(
      `Drive file ${id} could not be downloaded (${res.status}). It is probably private: share it as ` +
        `"anyone with the link", or download it yourself and pass the local path instead.`,
    );
  }
  const disposition = res.headers.get("content-disposition") ?? "";
  const name =
    decodeURIComponent(disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1] ?? "") || disposition.match(/filename="([^"]+)"/i)?.[1] || `${id}.bin`;
  const file = join(WORK, `${id}${extname(name).toLowerCase()}`);
  if (existsSync(file) && statSync(file).size === Number(res.headers.get("content-length"))) {
    await res.body?.cancel();
  } else {
    process.stdout.write(`  downloading ${name} (${mb(Number(res.headers.get("content-length") ?? 0))})…`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
    process.stdout.write(" done\n");
  }
  return { file, name };
}

function probe(file) {
  const j = JSON.parse(run(FFPROBE, ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file]));
  const v = j.streams.find((s) => s.codec_type === "video");
  const a = j.streams.find((s) => s.codec_type === "audio");
  return {
    width: v?.width,
    height: v?.height,
    codec: v?.codec_name,
    duration: Number(j.format.duration ?? 0),
    bitrate: Number(j.format.bit_rate ?? 0),
    audio: !!a,
    audioCodec: a?.codec_name,
  };
}

/** The ffmpeg scale filter that brings the long edge down to MAX_EDGE, or null */
const scaleFor = ({ width, height }) =>
  Math.max(width, height) > MAX_EDGE ? (width >= height ? `scale=${MAX_EDGE}:-2:flags=lanczos` : `scale=-2:${MAX_EDGE}:flags=lanczos`) : null;

function prepareVideo(src, info, out) {
  const scale = scaleFor(info);
  const audioArgs = info.audio ? (info.audioCodec === "aac" ? ["-c:a", "copy"] : ["-c:a", "aac", "-b:a", "192k"]) : ["-an"];
  // 1. Untouched (fast-start remux) when it is H.264, small enough and not oversized
  if (!scale && info.codec === "h264" && statSync(src).size <= UPLOAD_CAP) {
    ff(["-i", src, "-map", "0:v:0", "-map", "0:a:0?", "-c", "copy", "-movflags", "+faststart", out]);
    return "kept as delivered (fast-start remux, no re-encode)";
  }
  // 2. Re-encode at near-transparent quality, capped at what fits under the upload limit
  const audioKbps = info.audio ? 192 : 0;
  const fitKbps = Math.floor((UPLOAD_CAP * 8) / info.duration / 1000) - audioKbps;
  const vf = ["-pix_fmt", "yuv420p", ...(scale ? ["-vf", scale] : [])];
  const common = ["-c:v", "libx264", "-preset", "slow", ...vf];
  ff(["-i", src, ...common, "-crf", "16", "-maxrate", `${Math.min(fitKbps, 16000)}k`, "-bufsize", `${Math.min(fitKbps, 16000) * 2}k`, ...audioArgs, "-movflags", "+faststart", out]);
  if (statSync(out).size <= UPLOAD_CAP) return `re-encoded (H.264 CRF 16${scale ? `, scaled to ${MAX_EDGE}` : ""})`;
  // 3. Still too big: 2-pass at exactly the bitrate that fits
  const log = join(WORK, "pass");
  ff(["-i", src, ...common, "-b:v", `${fitKbps}k`, "-pass", "1", "-passlogfile", log, "-an", "-f", "mp4", process.platform === "win32" ? "NUL" : "/dev/null"]);
  ff(["-i", src, ...common, "-b:v", `${fitKbps}k`, "-pass", "2", "-passlogfile", log, ...audioArgs, "-movflags", "+faststart", out]);
  return `re-encoded to fit 100 MB (H.264 2-pass ${(fitKbps / 1000).toFixed(2)} Mbps${scale ? `, scaled to ${MAX_EDGE}` : ""})`;
}

async function upload(file, folder, fileName) {
  if (opt["dry-run"]) return `${folder}/${fileName} (dry run, not uploaded)`;
  const form = new FormData();
  form.set("file", await openAsBlob(file), fileName);
  form.set("fileName", fileName);
  form.set("folder", folder);
  form.set("useUniqueFileName", "false");
  form.set("overwriteFile", String(opt.overwrite));
  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${KEY}:`).toString("base64") },
    body: form,
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) fail(`Upload of ${fileName} failed (${res.status}): ${j.message ?? "unknown error"}${res.status === 409 || /exist/i.test(j.message ?? "") ? " Use a new --name, or --overwrite." : ""}`);
  return j.filePath;
}

/* ---------- main ---------- */

const pasteWork = [];
const pasteCards = [];
const warnings = [];

for (const input of inputs) {
  const id = driveId(input);
  console.log(`\n▸ ${input}`);
  const { file: src, name: original } = id ? await download(id) : existsSync(input) ? { file: resolve(input), name: basename(input) } : fail(`Not a Drive file link or a local file: ${input}`);
  const ext = extname(original).toLowerCase();
  const drive = id ?? opt.drive;
  let name = opt.name ?? slugify(original);
  // Generic Drive names ("1.png", "Final.mp4") would collide across folders: add part of the id
  if (!opt.name && drive && (name.length < 4 || /^\d+$/.test(name) || /^(final|untitled|video|image|export)(-\d+)?$/.test(name))) {
    name = `${name}-${drive.replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toLowerCase()}`;
  }
  if (!name) fail(`Could not make a file name from "${original}"; pass --name`);
  const workFolder = `${IK_ROOT}/work/${opt.industry}`;
  const key = drive ?? `<drive id of ${original}>`;

  if (IMAGE.has(ext)) {
    const [w, h] = run(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src]).trim().split(",").map(Number);
    console.log(`  still ${w}x${h}, ${mb(statSync(src).size)}`);
    if (statSync(src).size > UPLOAD_CAP) fail(`${original} is over 100 MB; export a smaller image`);
    const path = await upload(src, workFolder, `${name}${ext}`);
    console.log(`  uploaded → ${path}`);
    pasteWork.push(`  "${key}": still("${opt.industry}", "${name}${ext}"),`);
    pasteCards.push(`  { title: "…", category: "…", drive: "${key}", kind: "still", ratio: [${w}, ${h}] },`);
    continue;
  }
  if (!VIDEO.has(ext)) fail(`${original}: not a video or image this script handles (${ext || "no extension"})`);

  const info = probe(src);
  const short = Math.min(info.width, info.height);
  console.log(`  ${info.width}x${info.height} ${info.codec}, ${info.duration.toFixed(1)} s, ${(info.bitrate / 1e6).toFixed(1)} Mbps, ${mb(statSync(src).size)}`);
  if (short < 1080) {
    const msg = `${original}: ${info.width}x${info.height} is below 1080p and will look soft. Ask the studio for a 1080p export.`;
    warnings.push(msg);
    console.log(`  ⚠ ${msg}`);
  }

  const out = join(WORK, `${name}.mp4`);
  console.log(`  ${prepareVideo(src, info, out)} → ${mb(statSync(out).size)}`);

  // Card frame for the work page, kept on the site (no ImageKit video processing)
  const frameDir = join(ROOT, "public", "images", "work", opt.industry);
  mkdirSync(frameDir, { recursive: true });
  const frame = join(frameDir, `${name}.jpg`);
  ff(["-ss", String(Math.min(1, info.duration / 2)), "-i", out, "-frames:v", "1", "-vf", "scale='min(1600,iw)':-2", "-q:v", "3", frame]);
  console.log(`  card frame → public/images/work/${opt.industry}/${name}.jpg`);

  const path = await upload(out, workFolder, `${name}.mp4`);
  console.log(`  uploaded → ${path}`);
  pasteWork.push(`  "${key}": film("${opt.industry}", "${name}"),`);
  pasteCards.push(`  { title: "…", category: "…", drive: "${key}", kind: "film", ratio: [${info.width}, ${info.height}] },`);

  if (opt["loop-at"] !== undefined) {
    const at = Number(opt["loop-at"]);
    if (!(at >= 0) || at + LOOP_SECONDS > info.duration) fail(`--loop-at ${opt["loop-at"]} needs ${LOOP_SECONDS} s of film after it (film is ${info.duration.toFixed(1)} s)`);
    const filters = [opt["loop-crop"] && `crop=${opt["loop-crop"]}`, scaleFor(info)].filter(Boolean).join(",");
    const loop = join(WORK, `${name}-loop.mp4`);
    const loopPoster = join(WORK, `${name}-loop.jpg`);
    ff(["-ss", String(at), "-i", src, "-t", String(LOOP_SECONDS), "-an", ...(filters ? ["-vf", filters] : []), "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-maxrate", "6000k", "-bufsize", "12000k", "-pix_fmt", "yuv420p", "-movflags", "+faststart", loop]);
    ff(["-i", loop, "-frames:v", "1", "-q:v", "3", loopPoster]);
    const [lw, lh] = run(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", loop]).trim().split(",").map(Number);
    const loopFolder = `${IK_ROOT}/videos/${opt.industry}`;
    console.log(`  loop ${lw}x${lh}, ${mb(statSync(loop).size)} → ${await upload(loop, loopFolder, `${name}.mp4`)}`);
    console.log(`  loop poster → ${await upload(loopPoster, loopFolder, `${name}.jpg`)}`);
    pasteCards.push(
      `  // industry-details.ts, on the category card:\n  image: { src: media("/videos/${opt.industry}/${name}.jpg"), alt: "…" },\n  video: media("/videos/${opt.industry}/${name}.mp4"),\n  ratio: [${lw}, ${lh}],`,
    );
  }
}

console.log(`\n── src/content/hosted-work.ts (HOSTED_WORK) ──\n${pasteWork.join("\n")}`);
console.log(`\n── src/content/industry-details.ts (work.items / category card) ──\n${pasteCards.join("\n")}`);
if (warnings.length) console.log(`\n── Ask the studio ──\n${warnings.map((w) => `• ${w}`).join("\n")}`);
console.log(`\nCommit the card frames in public/images/work/${opt.industry}/ with the code change.`);
