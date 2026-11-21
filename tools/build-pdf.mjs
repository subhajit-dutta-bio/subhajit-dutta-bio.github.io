#!/usr/bin/env node
/* Renders /cv/ to assets/pdf/CV_Subhajit_Dutta.pdf using a local static server and
   headless Chromium / Chrome / Microsoft Edge, preserving the exact @media print
   layout and self-hosted Fraunces + IBM Plex fonts. Zero npm dependencies. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFile, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "pdf", "CV_Subhajit_Dutta.pdf");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf"
};

function findBrowser() {
  const env = process.env.CHROME_BIN;
  if (env && fs.existsSync(env)) return env;
  const winPaths = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  for (const p of winPaths) if (fs.existsSync(p)) return p;
  for (const cmd of ["google-chrome-stable", "google-chrome", "chromium-browser", "chromium", "microsoft-edge"]) {
    const r = spawnSync("which", [cmd], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}

const browser = findBrowser();
if (!browser) {
  console.warn("No Chromium/Chrome/Edge binary found; skipping CV PDF generation.");
  process.exit(0);
}

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(ROOT, cleanUrl.replace(/^\/+/, ""));
  if (cleanUrl.endsWith("/")) filePath = path.join(filePath, "index.html");
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), "cv-pdf-"));

server.listen(0, "127.0.0.1", () => {
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/cv/`;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  execFile(browser, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${tmpProfile}`,
    "--no-pdf-header-footer",
    "--print-to-pdf-no-header",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=2500",
    `--print-to-pdf=${OUT}`,
    url
  ], { timeout: 25000 }, (err, _stdout, stderr) => {
    server.close();
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch {}
    if (err && !fs.existsSync(OUT)) {
      console.error("Failed to generate CV PDF:", stderr || err.message);
      process.exit(1);
    }
    const size = fs.statSync(OUT).size;
    console.log(`Generated ${path.relative(ROOT, OUT)} (${Math.round(size / 1024)} KB)`);
    process.exit(0);
  });
});
