/* Subhajit Dutta — site script. Everything renders from the files in assets/data/. */
(function () {
  "use strict";
  const S = window.SITE || {};
  const P = S.profile || {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const el = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === "class") e.className = attrs[k]; else if (k.startsWith("aria") || k.startsWith("data")) e.setAttribute(k, attrs[k]); else e[k] = attrs[k]; } if (html != null) e.innerHTML = html; return e; };
  const strip = s => String(s).replace(/<[^>]+>/g, "");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const unset = v => !v || /REPLACE/i.test(v);

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast"); if (!t) { t = el("div", {class: "toast", role: "status"}); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
  }
  async function copyText(text, fallbackEl) {
    try { await navigator.clipboard.writeText(text); toast("Copied"); return true; }
    catch (e) {
      if (fallbackEl) { const r = document.createRange(); r.selectNodeContents(fallbackEl); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast("Select and copy"); }
      return false;
    }
  }

  /* ---------- Theme ---------- */
  (function theme() {
    const root = document.documentElement, btn = $("#themeBtn");
    try { const saved = localStorage.getItem("theme"); if (saved) root.dataset.theme = saved; } catch (e) {}
    if (!btn) return;
    const current = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      if (window.__drawField) window.__drawField(true);
    });
  })();

  /* ---------- Navigation ---------- */
  (function nav() {
    const page = document.body.dataset.page;
    $$(".tabs a").forEach(a => { if (a.dataset.page === page) a.setAttribute("aria-current", "page"); });
    const nav = $(".nav"), btn = $("#menuBtn");
    if (btn && nav) {
      btn.addEventListener("click", () => { const open = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", String(open)); });
      document.addEventListener("click", e => { if (!nav.contains(e.target)) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
    }
  })();

  /* ---------- Profile-driven bits ---------- */
  (function profile() {
    // Portrait
    const port = $("#portrait");
    if (port) {
      if (P.photo) { port.innerHTML = ""; port.appendChild(el("img", {src: P.photo, alt: P.name || "Portrait", loading: "eager"})); }
    }
    // Profile links (any element with data-link="scholar" etc.)
    $$("[data-link]").forEach(node => {
      const key = node.dataset.link, href = P.links && P.links[key];
      const row = node.closest("[data-link-row]") || node;
      if (!href) { row.hidden = true; return; }
      row.hidden = false;
      const a = node.tagName === "A" ? node : $("a", node);
      if (a) { a.href = href; if (!a.textContent.trim() || a.dataset.fillHost) a.textContent = href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); }
    });
    // CV button
    $$("[data-cv]").forEach(a => { if (P.cvPdf) a.href = P.cvPdf; else a.hidden = true; });
    // Email text + copy
    $$("[data-email]").forEach(n => { n.textContent = P.email || ""; });
    $$("[data-copy-email]").forEach(b => b.addEventListener("click", () => copyText(P.email, $("[data-email]"))));
    // Legal
    $$("[data-legal-address]").forEach(n => { n.textContent = P.legal && P.legal.address ? P.legal.address : ""; if (unset(P.legal && P.legal.address)) n.classList.add("todo"); });
    $$("[data-legal-phone]").forEach(n => { const ph = P.legal && P.legal.phone; if (ph) n.textContent = ph; else n.closest("p") && (n.closest("p").hidden = true); });
    // Analytics
    if (P.goatcounter && !unset(P.goatcounter)) {
      const s = document.createElement("script");
      s.async = true; s.dataset.goatcounter = `https://${P.goatcounter}.goatcounter.com/count`; s.src = "https://gc.zgo.at/count.js";
      document.head.appendChild(s);
    }
  })();

  /* ---------- Hero director field (home page) ---------- */
  (function field() {
    const canvas = $("#field"); if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = 0, running = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const defects = [
      { x: 0.60, y: 0.40, q: 0.5,  ax: 0.030, ay: 0.040, s: 0.21 },
      { x: 0.86, y: 0.70, q: -0.5, ax: 0.035, ay: 0.030, s: 0.17 }
    ];
    function resize() {
      const r = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(force) {
      if (!W || !H) resize();
      const t = performance.now() / 1000;
      const cs = getComputedStyle(document.documentElement);
      const cField = cs.getPropertyValue("--field").trim(), cDim = cs.getPropertyValue("--field-dim").trim();
      const step = W < 600 ? 16 : 20, len = step * 0.62;
      ctx.clearRect(0, 0, W, H);
      const ds = defects.map(d => ({ x: (d.x + Math.sin(t * d.s) * d.ax) * W, y: (d.y + Math.cos(t * d.s * 0.8) * d.ay) * H, q: d.q }));
      for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) {
        let theta = 0.35 * Math.sin(x / W * 4.1 + t * 0.12) * Math.cos(y / H * 3.3 - t * 0.09), dmin = 1e9;
        for (const d of ds) { const dx = x - d.x, dy = y - d.y; theta += d.q * Math.atan2(dy, dx); dmin = Math.min(dmin, Math.hypot(dx, dy)); }
        const near = Math.max(0, 1 - dmin / (W * 0.22));
        ctx.strokeStyle = near > 0.45 ? cField : cDim; ctx.globalAlpha = 0.22 + 0.55 * near * near; ctx.lineWidth = 1 + near;
        const c = Math.cos(theta) * len / 2, s = Math.sin(theta) * len / 2;
        ctx.beginPath(); ctx.moveTo(x - c, y - s); ctx.lineTo(x + c, y + s); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (const d of ds) { ctx.beginPath(); ctx.arc(d.x, d.y, 3.5, 0, Math.PI * 2); ctx.fillStyle = cField; ctx.fill(); }
      if (running && !reduced && !force) raf = requestAnimationFrame(() => draw(false));
    }
    window.__drawField = draw;
    const start = () => { if (running) return; running = true; if (reduced) draw(true); else raf = requestAnimationFrame(() => draw(false)); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    resize(); draw(true);
    addEventListener("resize", () => { resize(); draw(true); });
    if ("IntersectionObserver" in window) new IntersectionObserver(en => { en[0].isIntersecting ? start() : stop(); }, { threshold: 0.05 }).observe(canvas); else start();
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
  })();

  /* ---------- Publications ---------- */
  const PUBS = (S.pubs || []).slice();
  function pubHref(p) { return p.url || (p.doi ? "https://doi.org/" + p.doi : null); }
  function bibtex(p) {
    const authors = strip(p.authors).replace(/\(.*?\)/g, "").replace(/\*/g, "").replace(/,?\s*et al\.?/i, " and others").split(/,\s*/).map(a => a.trim()).filter(Boolean);
    const first = (authors[0] || "dutta").split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
    const word = strip(p.title).toLowerCase().split(/\s+/).find(w => w.length > 4 && !/^(the|with|from|across|through|cancer)$/.test(w)) || "paper";
    const key = `${first}${p.year}${word.replace(/[^a-z]/g, "")}`;
    const kind = p.type === "preprint" ? "misc" : p.type === "chapter" ? "incollection" : p.type === "patent" ? "misc" : "article";
    const lines = [`@${kind}{${key},`, `  title = {${strip(p.title)}},`, `  author = {${authors.join(" and ")}},`, `  year = {${p.year}},`];
    const [journal, rest] = strip(p.venue).split(/,\s*(.+)/);
    lines.push(`  ${kind === "incollection" ? "booktitle" : "journal"} = {${journal}},`);
    if (rest) lines.push(`  note = {${rest}},`);
    if (p.doi) lines.push(`  doi = {${p.doi}},`);
    const h = pubHref(p); if (h && !p.doi) lines.push(`  url = {${h}},`);
    lines.push("}");
    return lines.join("\n");
  }
  function pubNode(p) {
    const li = el("li", {class: "pub", "data-type": p.type});
    li.dataset.search = strip(`${p.title} ${p.authors} ${p.venue} ${p.year} ${p.note || ""}`).toLowerCase();
    const h = pubHref(p);
    const kindLabel = ({paper: "Article", review: "Manuscript", preprint: "Preprint", commentary: "Journal club", chapter: "Chapter", patent: "Patent", consortium: "Consortium"})[p.type] || "";
    const status = p.status && p.status !== "published" ? `<span class="st">${esc(p.status)}</span>` : "";
    const actions = [];
    if (h) actions.push(`<a class="btn sm" href="${h}" target="_blank" rel="noopener">${p.doi ? "DOI" : "Link"}</a>`);
    if (p.preprint) actions.push(`<a class="btn sm" href="https://doi.org/${p.preprint}" target="_blank" rel="noopener">Preprint</a>`);
    if (p.pdf) actions.push(`<a class="btn sm" href="${p.pdf}" target="_blank" rel="noopener">PDF</a>`);
    actions.push(`<button class="btn sm" type="button" data-bib>BibTeX</button>`);
    li.innerHTML = `
      <div class="pub-kind">${p.year}<br>${kindLabel}${status}</div>
      <div>
        <div class="pub-title">${h ? `<a href="${h}" target="_blank" rel="noopener">${p.title}</a>` : p.title}</div>
        <div class="pub-authors">${p.authors}</div>
        <div class="pub-venue"><i>${p.venue}</i></div>
        ${p.note ? `<div class="pub-note">${p.note}</div>` : ""}
        <div class="pub-actions">${actions.join("")}</div>
      </div>`;
    $("[data-bib]", li).addEventListener("click", () => copyText(bibtex(p)));
    return li;
  }
  (function publications() {
    const list = $("#pubList"); if (!list) return;
    const filters = $("#pubFilters"), search = $("#pubSearch"), summary = $("#pubSummary");
    const count = t => t === "all" ? PUBS.length : PUBS.filter(p => p.type === t).length;
    if (summary) summary.textContent = `${count("paper")} peer-reviewed articles, ${count("review")} manuscripts under review or in preparation, ${count("preprint")} preprints, ${count("commentary")} Nature Reviews journal-club pieces, ${count("patent")} patent application and consortium authorship on Global Burden of Disease studies. Click BibTeX on any entry to copy a citation.`;
    let type = "all", q = "";
    const hash = location.hash.replace("#", ""); if ((S.pubTypes || []).some(([k]) => k === hash)) type = hash;
    (S.pubTypes || []).forEach(([key, label]) => {
      const b = el("button", {type: "button", class: "chip", "data-type": key, "aria-pressed": String(key === type)}, `${label}<span class="n">${count(key)}</span>`);
      b.addEventListener("click", () => { type = key; $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", String(c.dataset.type === key))); apply(); });
      filters.appendChild(b);
    });
    PUBS.sort((a, b) => b.year - a.year);
    const frag = document.createDocumentFragment(); let year = null;
    PUBS.forEach(p => { if (p.year !== year) { year = p.year; frag.appendChild(el("li", {class: "pub-year-head", "data-year": year}, String(year))); } frag.appendChild(pubNode(p)); });
    list.appendChild(frag);
    const empty = el("li", {class: "pub-empty"}, "Nothing matches that filter."); empty.hidden = true; list.appendChild(empty);
    if (search) search.addEventListener("input", () => { q = search.value.trim().toLowerCase(); apply(); });
    function apply() {
      let shown = 0;
      $$(".pub", list).forEach(li => { const ok = (type === "all" || li.dataset.type === type) && (!q || li.dataset.search.includes(q)); li.hidden = !ok; if (ok) shown++; });
      $$(".pub-year-head", list).forEach(h => { let n = h.nextElementSibling, any = false; while (n && n.classList.contains("pub")) { if (!n.hidden) { any = true; break; } n = n.nextElementSibling; } h.hidden = !any; });
      empty.hidden = shown > 0;
    }
    apply();
  })();
  (function featured() {
    const host = $("#featuredPubs"); if (!host) return;
    const picks = PUBS.filter(p => p.featured).sort((a, b) => b.year - a.year).slice(0, 3);
    picks.forEach(p => {
      const h = pubHref(p) || (p.preprint ? "https://doi.org/" + p.preprint : "/publications/");
      host.appendChild(el("article", null, `<div class="k">${esc(strip(p.venue).split(",")[0])}, ${p.year}${p.status && p.status !== "published" ? `, ${esc(p.status)}` : ""}</div><h3><a href="${h}" ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${p.title}</a></h3><p>${p.authors}</p>`));
    });
  })();

  /* ---------- News ---------- */
  (function news() {
    const items = (S.news || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    const fmt = d => { const [y, m, day] = d.split("-").map(Number); return new Date(Date.UTC(y, m - 1, day || 1)).toLocaleDateString("en-GB", {day: day ? "numeric" : undefined, month: "long", year: "numeric", timeZone: "UTC"}); };
    const render = (host, limit) => {
      if (!host) return;
      items.slice(0, limit || items.length).forEach(n => {
        host.appendChild(el("li", {class: "row"}, `<div class="row-when">${fmt(n.date)}</div><div><div class="row-what" style="margin-top:0;font-size:1rem;color:var(--fg)">${n.text}${n.url ? ` <a href="${n.url}" target="_blank" rel="noopener" class="small">Read</a>` : ""}</div></div>`));
      });
    };
    render($("#newsList")); render($("#newsLatest"), 3);
  })();

  /* ---------- Talks ---------- */
  (function talks() {
    const host = $("#talksList"); if (!host) return;
    const filters = $("#talkFilters");
    const items = (S.talks || []).slice().sort((a, b) => b.sort.localeCompare(a.sort));
    const node = t => {
      const acts = [];
      if (t.url) acts.push(`<a class="btn sm" href="${t.url}" target="_blank" rel="noopener">Abstract</a>`);
      if (t.slides) acts.push(`<a class="btn sm" href="${t.slides}" target="_blank" rel="noopener">Slides</a>`);
      if (t.poster) acts.push(`<a class="btn sm" href="${t.poster}" target="_blank" rel="noopener">Poster</a>`);
      if (t.photo) acts.push(`<button class="btn sm" type="button" data-photo="${t.photo}">Photo</button>`);
      const li = el("li", {class: "row", "data-kind": t.kind}, `<div class="row-when">${esc(t.when)}<br><span class="small">${t.kind === "talk" ? "Talk" : "Poster"}</span></div><div><div class="row-title">${esc(t.title)}</div><div class="row-where">${esc(t.where)}</div>${t.what ? `<p class="row-what">${t.what}</p>` : ""}${t.tag ? `<span class="row-tag">${esc(t.tag)}</span>` : ""}${acts.length ? `<div class="row-actions">${acts.join("")}</div>` : ""}</div>`);
      const pb = $("[data-photo]", li); if (pb) pb.addEventListener("click", () => openLightbox([{src: t.photo, caption: t.title}], 0));
      return li;
    };
    items.forEach(t => host.appendChild(node(t)));
    if (filters) {
      let kind = "all";
      [["all", "All"], ["talk", "Talks"], ["poster", "Posters"]].forEach(([k, label]) => {
        const n = k === "all" ? items.length : items.filter(t => t.kind === k).length;
        const b = el("button", {type: "button", class: "chip", "data-kind": k, "aria-pressed": String(k === kind)}, `${label}<span class="n">${n}</span>`);
        b.addEventListener("click", () => { kind = k; $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", String(c.dataset.kind === k))); $$(".row", host).forEach(li => li.hidden = kind !== "all" && li.dataset.kind !== kind); });
        filters.appendChild(b);
      });
    }
  })();

  /* ---------- Awards ---------- */
  (function awards() {
    const groupsHost = $("#awardGroups"); if (!groupsHost) return;
    const items = (S.awards || []).slice().sort((a, b) => String(b.sort).localeCompare(String(a.sort)));
    const cards = $("#awardCards");
    if (cards) items.filter(a => a.highlight).slice(0, 3).forEach(a => cards.appendChild(el("article", {class: "award-card"},
      `<div class="award-year">${esc(a.when)}</div><h3>${esc(a.title)}</h3>${a.where ? `<p>${esc(a.where)}</p>` : ""}`)));
    (S.awardGroups || []).forEach(([key, label]) => {
      const list = items.filter(a => a.group === key); if (!list.length) return;
      const sec = el("section", {class: "section", "aria-label": label});
      sec.innerHTML = `<div class="wrap"><div class="section-head"><h2>${esc(label)}</h2></div><ol class="rows"></ol></div>`;
      const ol = $("ol", sec);
      list.forEach(a => ol.appendChild(el("li", {class: "row"}, `<div class="row-when">${esc(a.when)}</div><div><div class="row-title">${esc(a.title)}</div>${a.where ? `<div class="row-where">${esc(a.where)}</div>` : ""}${a.note ? `<p class="row-what">${esc(a.note)}</p>` : ""}</div>`)));
      groupsHost.appendChild(sec);
    });
  })();

  /* ---------- Gentle reveal on scroll ---------- */
  (function reveal() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    requestAnimationFrame(() => {
      const targets = $$("main .section .wrap > *, .page-head .wrap > *").filter(n => n.getBoundingClientRect().top > innerHeight * 0.9);
      if (!targets.length) return;
      targets.forEach(n => n.classList.add("reveal"));
      const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
      targets.forEach(n => io.observe(n));
    });
  })();

  /* ---------- Media gallery + lightbox ---------- */
  const MEDIA = (S.media || []).slice();
  let lb = null;
  function openLightbox(items, index) {
    const imgs = items.filter(i => (i.type || "image") === "image"); if (!imgs.length) return;
    let i = Math.max(0, imgs.indexOf(items[index]));
    if (!lb) {
      lb = el("div", {class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Image viewer"});
      lb.innerHTML = `<div class="lb-img"><img alt=""></div><div class="lb-bar"><p></p><div class="lb-nav"><button class="icon-btn" type="button" data-prev aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button class="icon-btn" type="button" data-next aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div></div><button class="icon-btn lb-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
      document.body.appendChild(lb);
      lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".lb-close") || e.target.classList.contains("lb-img")) close(); });
      $("[data-prev]", lb).addEventListener("click", () => show(i - 1));
      $("[data-next]", lb).addEventListener("click", () => show(i + 1));
      document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    }
    function show(k) { i = (k + imgs.length) % imgs.length; const im = $("img", lb); im.src = imgs[i].src; im.alt = imgs[i].caption || ""; $(".lb-bar p", lb).textContent = imgs[i].caption || ""; $(".lb-nav", lb).hidden = imgs.length < 2; }
    function close() { lb.hidden = true; document.body.style.overflow = ""; }
    show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lb-close", lb).focus();
  }
  (function gallery() {
    const host = $("#gallery"); if (!host) return;
    const filters = $("#mediaFilters"), empty = $("#mediaEmpty");
    if (!MEDIA.length) { if (empty) empty.hidden = false; if (filters) filters.hidden = true; return; }
    const docIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`;
    MEDIA.forEach((m, idx) => {
      const isDoc = (m.type || "image") !== "image";
      const fig = el("figure", {class: `tile${m.wide ? " wide" : ""}${isDoc ? " doc" : ""}`, "data-group": m.group || "figures", tabIndex: 0});
      if (isDoc) { fig.innerHTML = `<a href="${m.src}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${docIcon}<span>${esc(m.caption || "Document")}</span></a>`; }
      else { fig.innerHTML = `<img src="${m.src}" alt="${esc(m.caption || "")}" loading="lazy"><figcaption>${esc(m.caption || "")}</figcaption>`; fig.addEventListener("click", () => openLightbox(visible(), visible().indexOf(m))); fig.addEventListener("keydown", e => { if (e.key === "Enter") fig.click(); }); }
      host.appendChild(fig);
    });
    let group = "all";
    const visible = () => MEDIA.filter(m => group === "all" || (m.group || "figures") === group);
    if (filters) (S.mediaGroups || []).forEach(([k, label]) => {
      const n = k === "all" ? MEDIA.length : MEDIA.filter(m => (m.group || "figures") === k).length; if (!n) return;
      const b = el("button", {type: "button", class: "chip", "data-group": k, "aria-pressed": String(k === group)}, `${label}<span class="n">${n}</span>`);
      b.addEventListener("click", () => { group = k; $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", String(c.dataset.group === k))); $$(".tile", host).forEach(t => t.hidden = group !== "all" && t.dataset.group !== group); });
      filters.appendChild(b);
    });
  })();
  (function themeFigures() {
    $$("[data-theme-fig]").forEach(fig => {
      const m = MEDIA.find(x => x.theme === fig.dataset.themeFig && (x.type || "image") === "image");
      if (!m) { fig.hidden = true; return; }
      fig.innerHTML = `<figure><img src="${m.src}" alt="${esc(m.caption || "")}" loading="lazy"><figcaption>${esc(m.caption || "")}</figcaption></figure>`;
      $("img", fig).addEventListener("click", () => openLightbox([m], 0));
    });
  })();

  /* ---------- Collaboration form (Web3Forms → Gmail) ---------- */
  (function form() {
    const f = $("#collabForm"); if (!f) return;
    const msg = $("#formMsg"), btn = $("button[type=submit]", f);
    const keyOk = !unset(P.web3formsKey);
    if (!keyOk) { msg.className = "form-msg"; msg.textContent = `The form is being set up. Until then, please email me directly at ${P.email}.`; btn.disabled = true; /* add web3formsKey in assets/data/profile.js */ }
    f.addEventListener("submit", async e => {
      e.preventDefault();
      if ($("[name=botcheck]", f).checked) return;
      if (!keyOk) return;
      const data = new FormData(f);
      data.append("access_key", P.web3formsKey);
      data.append("subject", `[Website] ${data.get("topic")}: ${data.get("name")}`);
      data.append("from_name", "subhajit-dutta website");
      btn.disabled = true; msg.className = "form-msg"; msg.textContent = "Sending…";
      try {
        const r = await fetch("https://api.web3forms.com/submit", {method: "POST", body: data, headers: {Accept: "application/json"}});
        const j = await r.json();
        if (j.success) { msg.className = "form-msg ok"; msg.textContent = "Sent. I reply to every message, usually within a few days."; f.reset(); }
        else throw new Error(j.message || "Could not send");
      } catch (err) {
        msg.className = "form-msg err"; msg.textContent = `Could not send (${err.message}). Email me directly at ${P.email}.`;
      } finally { btn.disabled = false; }
    });
  })();
})();
