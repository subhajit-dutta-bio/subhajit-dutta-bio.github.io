#!/usr/bin/env node
/* Site build: renders the lists in assets/data/*.js into the HTML pages as static markup,
   shares one header and footer across pages, and writes sitemap.xml and feed.xml.

   Usage (from the repository root):
     node tools/build.mjs           update every page in place
     node tools/build.mjs --check   exit 1 if any page is out of date (used by CI)

   Pages keep their own text; the build only rewrites what sits between markers like
     <!-- build:pubs --> … <!-- /build:pubs -->
   so running it twice changes nothing. No dependencies beyond Node 18+. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const rd = p => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ---------- Load data exactly as the browser would ---------- */
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["profile", "publications", "news", "talks", "awards", "media", "network", "software", "cv"]) {
  vm.runInContext(rd(`assets/data/${f}.js`), ctx, { filename: `${f}.js` });
}
const S = ctx.window.SITE;
const P = S.profile;
const POS = P.position || {};

/* ---------- Helpers ---------- */
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = s => String(s ?? "").replace(/<[^>]+>/g, "");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtDate = d => { const [y, m, day] = d.split("-").map(Number); return `${day ? day + " " : ""}${MONTHS[m - 1]} ${y}`; };
const today = (() => {
  // Build date in Europe/Berlin, so the footer matches where the site is edited.
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return parts; // YYYY-MM-DD
})();
// The footer shows the date of the last build. In --check mode, reuse the date already on the
// home page so that a check run on a later day does not report a date-only difference.
const stamped = (rd("index.html").match(/<span class="upd">Updated <time datetime="(\d{4}-\d{2}-\d{2})"/) || [])[1];
const UPDATED = P.updated || (CHECK && stamped ? stamped : today);
const ext = h => h.startsWith("http") ? ' target="_blank" rel="noopener"' : "";

/* ---------- Publications ---------- */
const PENDING_ST = ["under review", "submitted", "in preparation"];
const isPending = p => PENDING_ST.includes(p.status) && !p.doi && !p.url;
const ALL = S.pubs.map((p, i) => ({ ...p, i }));
const PUBS = ALL.filter(p => !isPending(p)).sort((a, b) => b.year - a.year || a.i - b.i);
const PENDING = ALL.filter(isPending).sort((a, b) => b.year - a.year || a.i - b.i);
const href = p => p.url || (p.doi ? "https://doi.org/" + p.doi : null);
function role(p) {
  if (p.role) return p.role;
  const a = strip(p.authors).trim();
  if (p.type === "consortium") return null;
  if (a === "Dutta S") return "sole";
  if (/Dutta S\*/.test(a)) return "co-first";
  if (/^Dutta S\b/.test(a)) return "first";
  return null;
}
const ROLE_LABEL = { sole: "Sole author", first: "First author", "co-first": "Co-first author", inventor: "Lead inventor" };
const badge = p => { const r = role(p); return r ? `<span class="badge badge-${r}">${ROLE_LABEL[r]}</span>` : ""; };
const KIND = { paper: "Article", review: "Manuscript", preprint: "Preprint", commentary: "Journal club", chapter: "Chapter", patent: "Patent", consortium: "Consortium" };
const count = t => t === "all" ? PUBS.length : t === "selected" ? PUBS.filter(p => p.selected).length : PUBS.filter(p => p.type === t).length;
const leadCount = PUBS.filter(p => ["paper", "preprint"].includes(p.type) && ["sole", "first", "co-first"].includes(role(p))).length;

function pubItem(p) {
  const h = href(p);
  const st = p.status && p.status !== "published" ? `<span class="st">${esc(p.status)}</span>` : "";
  const acts = [];
  if (h) acts.push(`<a class="btn sm" href="${esc(h)}"${ext(h)}>${p.doi ? "DOI" : "Link"}</a>`);
  if (p.preprint) acts.push(`<a class="btn sm" href="https://doi.org/${esc(p.preprint)}" target="_blank" rel="noopener">Preprint</a>`);
  if (p.pdf) acts.push(`<a class="btn sm" href="${esc(p.pdf)}" target="_blank" rel="noopener">PDF</a>`);
  if (p.code) acts.push(`<a class="btn sm" href="${esc(p.code)}" target="_blank" rel="noopener">Code</a>`);
  acts.push(`<button class="btn sm" type="button" data-bib>BibTeX</button>`);
  const search = strip(`${p.title} ${p.authors} ${p.venue || ""} ${p.year} ${p.note || ""}`).toLowerCase();
  const thumb = p.fig ? `<a class="pub-thumb" href="${esc(h || p.fig)}"${ext(h || "")} tabindex="-1" aria-hidden="true"><img src="${esc(p.fig)}" alt="" loading="lazy" decoding="async"></a>` : "";
  return `<li class="pub${p.fig ? " has-thumb" : ""}" data-i="${p.i}" data-type="${p.type}"${p.selected ? ' data-selected="1"' : ""} data-search="${esc(search)}">
        <div class="pub-kind"><span class="pub-yr">${p.year}</span><span>${KIND[p.type] || ""}</span>${st}${badge(p)}</div>
        <div class="pub-main">
          <div class="pub-title">${h ? `<a href="${esc(h)}"${ext(h)}>${p.title}</a>` : p.title}</div>
          <div class="pub-authors">${p.authors}</div>
          ${p.venue ? `<div class="pub-venue"><i>${p.venue}</i></div>` : ""}
          ${p.take ? `<p class="pub-take">${p.take}</p>` : ""}
          ${p.note ? `<div class="pub-note">${p.note}</div>` : ""}
          <div class="pub-actions">${acts.join("")}</div>
        </div>${thumb}
      </li>`;
}
function pubList() {
  let year = null; const out = [];
  for (const p of PUBS) {
    if (p.year !== year) { year = p.year; out.push(`<li class="pub-year-head" data-year="${year}">${year}</li>`); }
    out.push(pubItem(p));
  }
  out.push(`<li class="pub-empty" hidden>Nothing matches that filter.</li>`);
  return "\n      " + out.join("\n      ") + "\n    ";
}
const pubSummary = () => `${count("paper")} peer-reviewed articles, ${count("preprint")} preprints, ${count("commentary")} Nature Reviews journal-club pieces, a patent application and Global Burden of Disease consortium authorship. ${leadCount} of the articles and preprints are first-, co-first- or sole-author. Click BibTeX on any entry to copy a citation.`;
function pendingList() {
  return PENDING.map(p => `<li class="pend"><div class="pub-title">${p.title}</div><div class="pub-authors">${p.authors}</div><div class="pub-note">${esc(p.note || "Manuscript")} · ${esc(p.status)}</div></li>`).join("\n        ");
}
function featured() {
  return PUBS.filter(p => p.featured).sort((a, b) => b.year - a.year).slice(0, 3).map(p => {
    const h = href(p) || (p.preprint ? "https://doi.org/" + p.preprint : "/publications/");
    const venue = strip(p.venue || "").split(",")[0];
    const fig = p.fig ? `<a class="feat-fig" href="${esc(h)}"${ext(h)} tabindex="-1" aria-hidden="true"><img src="${esc(p.fig)}" alt="" loading="lazy" decoding="async"></a>` : "";
    return `<article>${fig}<div class="k"><span class="mono">${esc(venue)} · ${p.year}</span>${badge(p)}</div><h3><a href="${esc(h)}"${ext(h)}>${p.title}</a></h3><p>${p.authors}</p>${p.take ? `<p class="feat-take">${p.take}</p>` : ""}</article>`;
  }).join("\n      ");
}

/* ---------- News ---------- */
const NEWS = S.news.slice().sort((a, b) => b.date.localeCompare(a.date));
const newsRow = n => `<li class="row"><div class="row-when"><time datetime="${n.date}">${fmtDate(n.date)}</time></div><div><div class="row-what news-text">${n.text}${n.url ? ` <a href="${esc(n.url)}" target="_blank" rel="noopener" class="small">Read</a>` : ""}</div></div></li>`;
const newsRows = lim => NEWS.slice(0, lim || NEWS.length).map(newsRow).join("\n      ");

/* ---------- Talks ---------- */
const TALKS = S.talks.slice().sort((a, b) => b.sort.localeCompare(a.sort));
function talkRows() {
  return TALKS.map(t => {
    const acts = [];
    if (t.url) acts.push(`<a class="btn sm" href="${esc(t.url)}" target="_blank" rel="noopener">Abstract</a>`);
    if (t.slides) acts.push(`<a class="btn sm" href="${esc(t.slides)}" target="_blank" rel="noopener">Slides</a>`);
    if (t.poster) acts.push(`<a class="btn sm" href="${esc(t.poster)}" target="_blank" rel="noopener">Poster</a>`);
    if (t.photo) acts.push(`<button class="btn sm" type="button" data-photo="${esc(t.photo)}" data-caption="${esc(t.title)}">Photo</button>`);
    return `<li class="row" data-kind="${t.kind}"><div class="row-when">${esc(t.when)}<br><span class="small">${t.kind === "talk" ? "Talk" : "Poster"}</span></div><div><div class="row-title">${esc(t.title)}</div><div class="row-where">${esc(t.where)}</div>${t.what ? `<p class="row-what">${t.what}</p>` : ""}${t.tag ? `<span class="row-tag">${esc(t.tag)}</span>` : ""}${acts.length ? `<div class="row-actions">${acts.join("")}</div>` : ""}</div></li>`;
  }).join("\n      ");
}

/* ---------- Awards ---------- */
const AWARDS = S.awards.slice().sort((a, b) => String(b.sort).localeCompare(String(a.sort)));
const awardCards = () => AWARDS.filter(a => a.highlight).slice(0, 3).map(a => `<article class="award-card"><div class="award-year">${esc(a.when)}</div><h3>${esc(a.title)}</h3>${a.where ? `<p>${esc(a.where)}</p>` : ""}</article>`).join("\n      ");
const awardRow = a => `<li class="row"><div class="row-when">${esc(a.when)}</div><div><div class="row-title">${esc(a.title)}</div>${a.where ? `<div class="row-where">${esc(a.where)}</div>` : ""}${a.note ? `<p class="row-what">${esc(a.note)}</p>` : ""}</div></li>`;
function awardGroups() {
  return S.awardGroups.map(([key, label]) => {
    const list = AWARDS.filter(a => a.group === key); if (!list.length) return "";
    return `<section class="section" aria-label="${esc(label)}"><div class="wrap"><div class="section-head"><h2>${esc(label)}</h2></div><ol class="rows">\n      ${list.map(awardRow).join("\n      ")}\n    </ol></div></section>`;
  }).join("\n");
}

/* ---------- Network counts ---------- */
const N = S.network;
const nk = s => s.toLowerCase().replace(/[^a-z]/g, "");
const NET = { inst: N.inst.length, countries: new Set(N.inst.map(i => i.cc)).size, people: new Set(N.inst.flatMap(i => i.a).map(nk)).size };
const stats = () => `<a href="/publications/"><b>${leadCount}</b> first- or sole-author papers and preprints</a><span aria-hidden="true">·</span><a href="/collaborate/#h-net"><b>${NET.inst}</b> institutions</a><span aria-hidden="true">·</span><a href="/collaborate/#h-net"><b>${NET.countries}</b> countries</a><span aria-hidden="true">·</span><a href="/collaborate/#h-net"><b>${NET.people}</b> co-authors</a>`;

/* ---------- Journey, methods, software ---------- */
const journeyRow = j => `<li class="row"><div class="row-when">${j.when}</div><div><div class="row-title">${j.title}</div><div class="row-where">${j.where}</div>${j.what ? `<p class="row-what">${j.what}</p>` : ""}</div></li>`;
const journey = () => S.journey.map(journeyRow).join("\n      ");
const methods = () => S.methods.map(m => `<div><dt>${m.k}</dt><dd>${m.v}</dd></div>`).join("\n      ");
function software() {
  return S.softwareGroups.map(([key, label]) => {
    const list = S.software.filter(s => s.group === key); if (!list.length) return "";
    const cards = list.map(s => {
      const url = `https://github.com/${s.repo}`;
      const meta = [s.lang, s.licence ? `${s.licence} licence` : ""].filter(Boolean).join(" · ");
      return `<li><a class="tool" href="${esc(url)}" target="_blank" rel="noopener"><span class="tool-k mono">${esc(meta || "Code")}</span><span class="tool-t">${esc(s.name)}</span><span class="tool-d">${esc(s.what)}</span><span class="tool-repo mono">github.com/${esc(s.repo)}</span>${s.doi ? `<span class="tool-doi mono">doi:${esc(s.doi)}</span>` : ""}</a></li>`;
    }).join("\n        ");
    return `<section class="section sw-group" aria-labelledby="sw-${key}"><div class="wrap"><div class="section-head"><h2 id="sw-${key}">${esc(label)}</h2></div><ul class="tools">\n        ${cards}\n      </ul></div></section>`;
  }).join("\n");
}

/* ---------- CV ---------- */
function cv() {
  const L = P.links || {};
  const contact = [
    `<a href="mailto:${esc(P.email)}">${esc(P.email)}</a>`,
    `<a href="https://orcid.org/${esc(P.orcid)}">ORCID ${esc(P.orcid)}</a>`,
    `<a href="${esc(P.siteUrl)}">${esc(P.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>`,
    L.github ? `<a href="${esc(L.github)}">${esc(L.github.replace(/^https?:\/\//, ""))}</a>` : "",
    L.scholar ? `<a href="${esc(L.scholar)}">Google Scholar</a>` : ""
  ].filter(Boolean).join('<span aria-hidden="true"> · </span>');
  const cvPub = p => {
    const h = href(p);
    return `<li><span class="cv-pub-t">${p.title}.</span> ${p.authors}. ${p.venue ? `<i>${p.venue}</i>` : ""}${p.year ? ` (${p.year})` : ""}${p.status && p.status !== "published" ? `, ${esc(p.status)}` : ""}.${h ? ` <a href="${esc(h)}">${esc(p.doi ? "doi:" + p.doi : h.replace(/^https?:\/\//, ""))}</a>` : ""}${role(p) ? ` <span class="badge badge-${role(p)}">${ROLE_LABEL[role(p)]}</span>` : ""}</li>`;
  };
  const block = (title, items, ordered) => items.length ? `<section class="cv-block"><h2>${title}</h2><${ordered ? "ol" : "ul"} class="cv-list">\n        ${items.join("\n        ")}\n      </${ordered ? "ol" : "ul"}></section>` : "";
  const byType = t => PUBS.filter(p => p.type === t);
  const row = (when, what) => `<li class="cv-row"><span class="cv-when mono">${when}</span><span>${what}</span></li>`;
  return `
    <header class="cv-head">
      <h1>${esc(P.name)}</h1>
      <p class="cv-sub">${esc(POS.headline || POS.role || "")}${POS.city ? ` · ${esc([POS.city, POS.country].filter(Boolean).join(", "))}` : ""}</p>
      <p class="cv-contact">${contact}</p>
    </header>
    <section class="cv-block"><h2>Research focus</h2><p>Experimental biologist and data-driven informatician. At the bench and the microscope I study telomeres and mitochondria in ageing and in cancer: how shelterin proteins regulate genes away from chromosome ends, and how mitochondria organise local translation in migrating cancer cells. In parallel I build and apply methods for large multi-omics cohorts, high-content image analysis and integrated omics and imaging, released as open tools.</p></section>
    ${block("Positions and education", S.journey.map(j => row(j.when, `<b>${j.title}</b>, ${j.where}${j.what ? `<br><span class="cv-note">${j.what}</span>` : ""}`)))}
    ${block("Peer-reviewed articles", byType("paper").map(cvPub), true)}
    ${block("Preprints", byType("preprint").map(cvPub), true)}
    ${block("Manuscripts under review or in preparation", PENDING.map(p => `<li><span class="cv-pub-t">${p.title}.</span> ${p.authors}. ${esc(p.note || "Manuscript")}, ${esc(p.status)}.</li>`), true)}
    ${block("Nature Reviews journal club", byType("commentary").map(cvPub), true)}
    ${block("Patent", byType("patent").map(cvPub))}
    ${block("Consortium authorship", byType("consortium").map(cvPub))}
    ${block("Talks and posters", TALKS.map(t => row(esc(t.when), `<b>${esc(t.title)}</b>, ${esc(t.where)}${t.tag ? ` <span class="cv-note">(${esc(t.tag)})</span>` : ""} <span class="cv-note">${t.kind === "talk" ? "talk" : "poster"}</span>`)))}
    ${S.awardGroups.map(([k, label]) => block(label, AWARDS.filter(a => a.group === k).map(a => row(esc(a.when), `<b>${esc(a.title)}</b>${a.where ? `, ${esc(a.where)}` : ""}`)))).join("\n    ")}
    <section class="cv-block"><h2>Methods</h2><dl class="skills">\n      ${methods()}\n    </dl></section>
    <p class="cv-foot small muted">Generated from the same records as this website · <time datetime="${UPDATED}">${fmtDate(UPDATED)}</time></p>
  `;
}

/* ---------- Research figures (first image tagged with each theme in media.js) ---------- */
function themeFig(key) {
  const m = S.media.find(x => x.theme === key && (x.type || "image") === "image");
  if (!m) return "";
  const dims = m.w && m.h ? ` width="${m.w}" height="${m.h}"` : "";
  const credit = m.credit ? `<span class="fig-credit">${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.credit)}</a>` : esc(m.credit)}</span>` : "";
  return `<figure class="${(m.group || "figures") === "figures" ? "plate" : "photo"}"><img src="${esc(m.src)}" alt="${esc(m.caption || "")}" loading="lazy" decoding="async"${dims} data-lightbox><figcaption>${esc(m.caption || "")}${credit}</figcaption></figure>`;
}

/* ---------- Header / footer ---------- */
const HEADER = rd("tools/partials/header.html");
const FOOTER = rd("tools/partials/footer.html");
const header = page => HEADER.replace(`data-page="${page}">`, `data-page="${page}" aria-current="page">`).trimEnd();
const footer = () => FOOTER
  .replace("{{YEAR}}", UPDATED.slice(0, 4))
  .replace("{{CITY}}", esc(POS.city || ""))
  .replace("{{UPDATED_ISO}}", UPDATED)
  .replace("{{UPDATED}}", `${MONTHS[Number(UPDATED.slice(5, 7)) - 1]} ${UPDATED.slice(0, 4)}`).trimEnd();
const HEADEXTRA = `<link rel="alternate" type="application/rss+xml" title="Subhajit Dutta: news" href="/feed.xml">
<link rel="preload" href="/assets/fonts/ibm-plex-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>`;

/* ---------- Pages ---------- */
const nowLine = [POS.headline || POS.role, POS.org].filter(Boolean).join(", ");
const PAGES = {
  "index.html": { page: "home", blocks: { now: () => esc(nowLine), latest: () => newsRows(3), featured, stats, journey } },
  "research/index.html": { page: "research", blocks: { methods, "fig-telomere": () => themeFig("telomere"), "fig-math": () => themeFig("math"), "fig-imaging": () => themeFig("imaging"), "fig-pancancer": () => themeFig("pancancer") } },
  "publications/index.html": { page: "publications", blocks: { "pub-summary": pubSummary, pubs: pubList, pending: pendingList, "pending-n": () => String(PENDING.length) } },
  "software/index.html": { page: "software", blocks: { software } },
  "talks/index.html": { page: "talks", blocks: { talks: talkRows } },
  "awards/index.html": { page: "awards", blocks: { "award-cards": awardCards, "award-groups": awardGroups } },
  "cv/index.html": { page: "cv", blocks: { cv } },
  "media/index.html": { page: "media", blocks: {} },
  "news/index.html": { page: "news", blocks: { news: () => newsRows() } },
  "collaborate/index.html": { page: "collaborate", blocks: {} },
  "legal/index.html": { page: "legal", blocks: {} },
  "404.html": { page: "404", blocks: {} }
};

function fill(html, name, content, file) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`, "g");
  if (!re.test(html)) throw new Error(`${file}: marker build:${name} not found`);
  return html.replace(re, (_, a, b) => `${a}${content}${b}`);
}

const versions = {};
const assetVersion = p => versions[p] ??= crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, p.slice(1)))).digest("hex").slice(0, 10);

const changed = [];
function write(rel, content) {
  const abs = path.join(ROOT, rel);
  const old = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  if (old === content) return;
  changed.push(rel);
  if (!CHECK) { fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, content); }
}

for (const [file, cfg] of Object.entries(PAGES)) {
  let html = rd(file);
  html = fill(html, "header", "\n" + header(cfg.page) + "\n", file);
  html = fill(html, "footer", "\n" + footer() + "\n", file);
  html = fill(html, "headextra", "\n" + HEADEXTRA + "\n", file);
  for (const [name, fn] of Object.entries(cfg.blocks)) html = fill(html, name, fn(), file);
  html = html.replace(/("dateModified": ")[^"]*(")/, `$1${UPDATED}$2`);
  // Cache-busting: every stylesheet and script link carries a hash of the file, so browsers fetch
  // a fresh copy whenever the file changes (Cloudflare tells browsers to cache assets for hours).
  html = html.replace(/(href|src)="(\/assets\/(?:site\.css|site\.js|data\/[\w-]+\.js))(?:\?v=[0-9a-f]+)?"/g, (_, attr, p) => `${attr}="${p}?v=${assetVersion(p)}"`);
  write(file, html);
}

/* ---------- sitemap.xml and feed.xml ---------- */
const site = P.siteUrl.replace(/\/$/, "");
const urls = ["/", "/research/", "/publications/", "/software/", "/talks/", "/awards/", "/cv/", "/collaborate/", "/media/", "/news/", "/legal/"];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${site}${u}</loc><lastmod>${UPDATED}</lastmod></url>`).join("\n")}
</urlset>
`);
const rfc822 = d => new Date(d + "T12:00:00Z").toUTCString();
write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Subhajit Dutta: news</title>
  <link>${site}/news/</link>
  <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Papers, preprints, talks and other updates from Subhajit Dutta.</description>
  <language>en</language>
  <lastBuildDate>${rfc822(NEWS[0].date)}</lastBuildDate>
${NEWS.map(n => `  <item>
    <title>${esc(strip(n.text).replace(/\s+/g, " ").slice(0, 110))}${strip(n.text).length > 110 ? "…" : ""}</title>
    <link>${esc(n.url || site + "/news/")}</link>
    <guid isPermaLink="false">${site}/news/#${n.date}-${nk(strip(n.text)).slice(0, 24)}</guid>
    <pubDate>${rfc822(n.date)}</pubDate>
    <description>${esc(strip(n.text))}</description>
  </item>`).join("\n")}
</channel>
</rss>
`);

if (CHECK) {
  if (changed.length) { console.error("Out of date, run `node tools/build.mjs`:\n  " + changed.join("\n  ")); process.exit(1); }
  console.log("All pages up to date.");
} else {
  console.log(changed.length ? "Updated:\n  " + changed.join("\n  ") : "Nothing to update.");
}
