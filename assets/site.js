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
    const current = () => root.dataset.theme || "dark";
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
    const cur = $(".tabs a[aria-current]"), ul = $(".tabs");
    if (cur && ul && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = Math.max(0, cur.offsetLeft - (ul.clientWidth - cur.offsetWidth) / 2);
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
      const cur = $("img", port);
      if (P.photo && (!cur || cur.getAttribute("src") !== P.photo)) { port.innerHTML = ""; port.appendChild(el("img", {src: P.photo, alt: P.name || "Portrait", loading: "eager"})); }
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
    if (P.updated) { const d = new Date(P.updated + "T12:00:00"); if (!isNaN(d)) $$("[data-updated]").forEach(n => { n.setAttribute("datetime", P.updated); n.textContent = d.toLocaleDateString("en-GB", {month: "long", year: "numeric"}); }); }
    const POS = P.position || {};
    const posVal = { role: POS.role, city: POS.city, orgFull: POS.orgFull, place: [POS.city, POS.country].filter(Boolean).join(", "), now: [POS.role, POS.org].filter(Boolean).join(", ") };
    $$("[data-pos]").forEach(n => { const v = posVal[n.dataset.pos]; if (v) n.textContent = v; });
    $$("[data-legal-address]").forEach(n => { n.textContent = P.legal && P.legal.address ? P.legal.address : ""; if (unset(P.legal && P.legal.address)) n.classList.add("todo"); });
    $$("[data-legal-phone]").forEach(n => { const ph = P.legal && P.legal.phone; if (ph) n.textContent = ph; else n.closest("p") && (n.closest("p").hidden = true); });
    // Analytics
    if (P.goatcounter && !unset(P.goatcounter)) {
      const s = document.createElement("script");
      s.async = true; s.dataset.goatcounter = `https://${P.goatcounter}.goatcounter.com/count`; s.src = "https://gc.zgo.at/count.js";
      document.head.appendChild(s);
    }
  })();

  /* ---------- Hero: live leading-edge simulation (home page) ----------
     Dendritic nucleation model: actin filaments polymerise toward the cell front (+x),
     Arp2/3 branches spawn at ~70°, capping stops growth, and the whole network
     undergoes retrograde flow. Mitochondria drift through the lamella and emit
     short-lived puffs of local translation. */
  (function cellField() {
    const canvas = $("#cellfield"); if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = (a, b) => a + Math.random() * (b - a);
    const BR = 70 * Math.PI / 180, FLOW = 26, VPOL = 90, CAP = 1.1, BRANCH = 3.2;
    let W = 0, H = 0, raf = 0, running = false, last = 0, bg = null, maxF = 300, t = 0, armed = false, visible = true, lastDraw = 0;
    const small = matchMedia("(max-width: 899px)").matches;
    const F = [], M = [], R = [];
    function resize() {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, small ? 1 : 1.5);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = ctx.createRadialGradient(W * 0.75, H * 0.4, 0, W * 0.75, H * 0.4, Math.max(W, H) * 0.9);
      bg.addColorStop(0, "#25539f"); bg.addColorStop(0.55, "#1b3f80"); bg.addColorStop(1, "#14306a");
      maxF = Math.round(Math.min(small ? 520 : 1100, Math.max(220, W * H / 1000)));
      seed();
    }
    const frontX = () => W * (0.2 + 0.85 * Math.pow(Math.random(), 0.6));
    function fil(x, y, a, grown) { return { x, y, a, len: grown ? rand(8, 50) : 0, max: rand(26, 70), grow: !grown || Math.random() < 0.35, age: grown ? rand(0, 4) : 0, life: rand(5, 9) }; }
    function mito(x) { return { x, y: rand(0, H), a: rand(-0.6, 0.6), L: rand(26, 66), w: rand(7, 10), v: rand(14, 34), ph: rand(0, 6.28), turn: rand(-0.3, 0.3), cr: Math.round(rand(3, 6)) }; }
    function seed() {
      F.length = 0; M.length = 0; R.length = 0;
      for (let i = 0; i < maxF * 0.25; i++) F.push(fil(rand(0, W), rand(0, H), rand(-0.7, 0.7), true));
      const nm = Math.round(Math.max(9, Math.min(28, W * H / 38000)));
      for (let i = 0; i < nm; i++) M.push(mito(rand(0, W)));
    }
    function step(dt) {
      t += dt;
      for (let i = F.length - 1; i >= 0; i--) {
        const f = F[i];
        f.x -= FLOW * dt; f.age += dt;
        if (f.grow) {
          f.len += VPOL * dt;
          if (f.len >= f.max || Math.random() < CAP * dt) f.grow = false;
          if (F.length < maxF && f.len > 12 && Math.random() < BRANCH * dt) {
            const s = rand(0.35, 1) * f.len, side = Math.random() < 0.5 ? -1 : 1;
            let a = f.a + side * BR; if (Math.abs(a) > 1.25) a = f.a - side * BR;
            F.push({ x: f.x + Math.cos(f.a) * s, y: f.y + Math.sin(f.a) * s, a, len: 0, max: rand(20, 60), grow: true, age: 0, life: rand(5, 9) });
          }
        }
        if (f.age > f.life || f.x + f.len < -30) F.splice(i, 1);
      }
      let need = Math.min(14, Math.max(0, Math.floor(maxF * 0.5) - F.length));
      while (need-- > 0) F.push(fil(frontX(), rand(-10, H + 10), rand(-0.6, 0.6), false));
      for (const m of M) {
        m.a += (m.turn + Math.sin(t * 0.7 + m.ph) * 0.25) * dt;
        if (Math.abs(m.a) > 0.9) m.turn = -Math.sign(m.a) * Math.abs(m.turn);
        m.x += (Math.cos(m.a) * m.v - FLOW * 0.35) * dt; m.y += Math.sin(m.a) * m.v * dt;
        if (m.x > W + 80) m.x = -80; if (m.x < -90) m.x = W + 70;
        if (m.y > H + 40) m.y = -40; if (m.y < -50) m.y = H + 30;
        if (Math.random() < 0.9 * dt) for (let k = 0; k < 4; k++) R.push({ x: m.x + rand(-m.L, m.L) * 0.7, y: m.y + rand(-14, 14), age: 0, life: rand(0.9, 1.8) });
      }
      for (let i = R.length - 1; i >= 0; i--) { const r = R[i]; r.age += dt; r.x -= FLOW * 0.5 * dt; if (r.age > r.life) R.splice(i, 1); }
    }
    const buckets = [[], [], [], []];
    function draw() {
      ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const b of buckets) b.length = 0;
      const tips = [];
      for (const f of F) {
        const fin = Math.min(1, f.age / 0.5), fout = Math.min(1, (f.life - f.age) / 1.8);
        const a = Math.max(0, Math.min(fin, fout));
        if (a <= 0.02) continue;
        buckets[Math.min(3, Math.floor(a * 4))].push(f);
        if (f.grow) tips.push(f);
      }
      ctx.lineWidth = 1.05; ctx.lineCap = "round";
      buckets.forEach((b, k) => {
        if (!b.length) return;
        ctx.strokeStyle = `rgba(111,231,236,${0.14 + k * 0.17})`;
        ctx.beginPath();
        for (const f of b) { ctx.moveTo(f.x, f.y); ctx.lineTo(f.x + Math.cos(f.a) * f.len, f.y + Math.sin(f.a) * f.len); }
        ctx.stroke();
      });
      ctx.fillStyle = "rgba(210,252,255,0.85)"; ctx.beginPath();
      for (const f of tips) { const x = f.x + Math.cos(f.a) * f.len, y = f.y + Math.sin(f.a) * f.len; ctx.moveTo(x + 1.6, y); ctx.arc(x, y, 1.6, 0, 6.283); }
      ctx.fill();
      for (const m of M) {
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.a);
        const L = m.L, w = m.w, r = w / 2;
        ctx.beginPath(); ctx.moveTo(-L / 2 + r, -r); ctx.lineTo(L / 2 - r, -r); ctx.arc(L / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2); ctx.lineTo(-L / 2 + r, r); ctx.arc(-L / 2 + r, 0, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
        ctx.fillStyle = "rgba(228,107,220,0.20)"; ctx.fill();
        ctx.lineWidth = 1.4; ctx.strokeStyle = "rgba(236,124,228,0.85)"; ctx.stroke();
        ctx.lineWidth = 0.9; ctx.strokeStyle = "rgba(246,170,240,0.55)"; ctx.beginPath();
        for (let k = 1; k <= m.cr; k++) { const x = -L / 2 + r + (k / (m.cr + 1)) * (L - w); const wob = Math.sin(t * 2 + k + m.ph) * 1.2; ctx.moveTo(x + wob, -r + 1.8); ctx.lineTo(x - wob, r - 1.8); }
        ctx.stroke(); ctx.restore();
      }
      ctx.beginPath();
      for (const r of R) { const a = 1 - r.age / r.life; ctx.moveTo(r.x + 1.5, r.y); ctx.arc(r.x, r.y, 1.1 + a * 0.8, 0, 6.283); }
      ctx.fillStyle = "rgba(255,197,107,0.75)"; ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    function frame(now) {
      if (!running) return;
      if (small && now - lastDraw < 32) { raf = requestAnimationFrame(frame); return; }
      lastDraw = now;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      step(dt); draw(); raf = requestAnimationFrame(frame);
    }
    const start = () => { if (running || reduced || !armed || !visible) return; running = true; last = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    resize();
    for (let i = 0; i < 60; i++) step(1 / 30); draw();
    const arm = () => { armed = true; start(); };
    const later = () => setTimeout(() => ("requestIdleCallback" in window ? requestIdleCallback(arm, { timeout: 2000 }) : arm()), 600);
    if (document.readyState === "complete") later(); else addEventListener("load", later, { once: true });
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduced) { for (let i = 0; i < 90; i++) step(1 / 30); } draw(); }, 150); });
    if ("IntersectionObserver" in window) new IntersectionObserver(en => { visible = en[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.02 }).observe(canvas);
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
  })();

  /* ---------- Publications ---------- */
  const PENDING_ST = ["under review", "submitted", "in preparation"];
  const isPending = p => PENDING_ST.includes(p.status) && !p.doi && !p.url;
  const ALLPUBS = (S.pubs || []).slice();
  const PUBS = ALLPUBS.filter(p => !isPending(p));
  const PENDING = ALLPUBS.filter(isPending);
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
        ${p.venue ? `<div class="pub-venue"><i>${p.venue}</i></div>` : ""}
        ${p.take ? `<p class="pub-take">${p.take}</p>` : ""}
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
    if (summary) summary.textContent = `${count("paper")} peer-reviewed articles, ${count("preprint")} preprints, ${count("commentary")} Nature Reviews journal-club pieces, ${count("patent")} patent application and consortium authorship on Global Burden of Disease studies. Click BibTeX on any entry to copy a citation.`;
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
    const pend = $("#pubPending");
    if (pend && PENDING.length) {
      $("[data-pending-n]", pend).textContent = PENDING.length;
      const ol = $("ol", pend);
      PENDING.sort((a, b) => b.year - a.year).forEach(p => ol.appendChild(el("li", {class: "pend"}, `<div class="pub-title">${p.title}</div><div class="pub-authors">${p.authors}</div><div class="pub-note">${esc(p.note || "Manuscript")} · ${esc(p.status)}</div>`)));
      if (location.hash === "#in-progress") pend.open = true;
    } else if (pend) pend.hidden = true;
  })();
  (function featured() {
    const host = $("#featuredPubs"); if (!host) return;
    const picks = PUBS.filter(p => p.featured).sort((a, b) => b.year - a.year).slice(0, 3);
    picks.forEach(p => {
      const h = pubHref(p) || (p.preprint ? "https://doi.org/" + p.preprint : "/publications/");
      host.appendChild(el("article", null, `<div class="k">${esc(strip(p.venue).split(",")[0])}, ${p.year}${p.status && p.status !== "published" ? `, ${esc(p.status)}` : ""}</div><h3><a href="${h}" ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${p.title}</a></h3><p>${p.authors}</p>${p.take ? `<p class="feat-take">${p.take}</p>` : ""}`));
    });
  })();

  /* ---------- News ---------- */
  (function news() {
    const items = (S.news || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    const fmt = d => { const [y, m, day] = d.split("-").map(Number); return new Date(Date.UTC(y, m - 1, day || 1)).toLocaleDateString("en-GB", {day: day ? "numeric" : undefined, month: "long", year: "numeric", timeZone: "UTC"}); };
    const render = (host, limit) => {
      if (!host) return;
      items.slice(0, limit || items.length).forEach(n => {
        host.appendChild(el("li", {class: "row"}, `<div class="row-when">${fmt(n.date)}</div><div><div class="row-what news-text">${n.text}${n.url ? ` <a href="${n.url}" target="_blank" rel="noopener" class="small">Read</a>` : ""}</div></div>`));
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
    function show(k) { i = (k + imgs.length) % imgs.length; const im = $("img", lb); im.src = imgs[i].src; im.alt = imgs[i].caption || ""; const bp = $(".lb-bar p", lb); bp.textContent = imgs[i].caption || ""; if (imgs[i].credit) { const c = el("span", {class: "fig-credit"}); if (imgs[i].link) { const a = el("a", {href: imgs[i].link, target: "_blank", rel: "noopener"}); a.textContent = imgs[i].credit; c.appendChild(a); } else c.textContent = imgs[i].credit; bp.appendChild(c); } $(".lb-nav", lb).hidden = imgs.length < 2; }
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
      if (isDoc) { fig.innerHTML = `<a href="${m.src}" target="_blank" rel="noopener" class="doc-link">${docIcon}<span>${esc(m.caption || "Document")}</span></a>`; }
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
      const dims = m.w && m.h ? ` width="${m.w}" height="${m.h}"` : "";
      const credit = m.credit ? `<span class="fig-credit">${m.link ? `<a href="${m.link}" target="_blank" rel="noopener">${esc(m.credit)}</a>` : esc(m.credit)}</span>` : "";
      fig.innerHTML = `<figure><img src="${m.src}" alt="${esc(m.caption || "")}" loading="lazy" decoding="async"${dims}><figcaption>${esc(m.caption || "")}${credit}</figcaption></figure>`;
      $("img", fig).addEventListener("click", () => openLightbox([m], 0));
    });
  })();

  /* ---------- Home profile card: live network counts ---------- */
  (function netCounts() {
    const N = S.network; if (!N || !$("[data-net]")) return;
    const k = s => s.toLowerCase().replace(/[^a-z]/g, "");
    const v = { inst: N.inst.length, countries: new Set(N.inst.map(i => i.cc)).size, people: new Set(N.inst.flatMap(i => i.a).map(k)).size };
    $$("[data-net]").forEach(n => { n.textContent = v[n.dataset.net]; });
  })();

  /* ---------- Collaboration globe (Collaborate page) ---------- */
  (function globe() {
    const canvas = $("#globe"), N = S.network;
    if (!canvas || !N || !window.d3 || !window.topojson || !d3.geoOrthographic) return;
    const ctx = canvas.getContext("2d");
    const stage = $("#netStage"), tip = $("#netTip"), detail = $("#netDetail"), list = $("#netList"), stats = $("#netStats"), tog = $("#gbdToggle");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const P = N.papers || [];
    const nameKey = s => s.toLowerCase().replace(/[^a-z]/g, "");

    // Group institutions by city so co-located partners share one point.
    const byCity = new Map();
    N.inst.forEach(i => {
      const k = `${i.c}|${i.cc}`;
      if (!byCity.has(k)) byCity.set(k, { c: i.c, cc: i.cc, country: i.country || i.cc, lat: i.lat, lng: i.lng, inst: [] });
      byCity.get(k).inst.push(i);
    });
    const C = [...byCity.values()];
    C.forEach(c => {
      c.papers = new Set(c.inst.flatMap(i => i.p));
      const ppl = new Map(); c.inst.flatMap(i => i.a).forEach(a => ppl.set(nameKey(a), a)); c.people = [...ppl.values()];
      c.home = Math.abs(c.lat - N.home.lat) < 0.05 && Math.abs(c.lng - N.home.lng) < 0.05;
      c.r = c.home ? 7 : Math.min(9, 3.6 + Math.sqrt(c.inst.length + c.people.length) * 0.7);
    });
    const arcs = [];
    for (let a = 0; a < C.length; a++) for (let b = a + 1; b < C.length; b++) {
      const shared = [...C[a].papers].filter(p => C[b].papers.has(p)); if (!shared.length) continue;
      const A = [C[a].lng, C[a].lat], B = [C[b].lng, C[b].lat];
      if (d3.geoDistance(A, B) < 0.015) continue;
      arcs.push({ A, B, n: shared.length, ip: d3.geoInterpolate(A, B), off: Math.random(), home: C[a].home || C[b].home });
    }

    // Stats
    const allPeople = new Map(); N.inst.flatMap(i => i.a).forEach(a => allPeople.set(nameKey(a), a));
    const allPapers = new Set(N.inst.flatMap(i => i.p));
    const ccs = new Set(N.inst.map(i => i.cc));
    if (stats) stats.innerHTML = [[N.inst.length, "institutions"], [ccs.size, "countries"], [allPeople.size, "co-authors"], [allPapers.size, "papers and abstracts"]].map(([v, k]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const note = $("#gbdNote"); if (note && N.gbd) note.textContent = `${N.gbd.institutions} institutions in ${N.gbd.countries} countries`;
    const src = $("#netSource"); if (src) src.textContent = `Points show ${N.source}. Counts exclude the ${N.gbd ? N.gbd.papers : 3} Global Burden of Disease consortium papers, each with hundreds of authors; switch them on as a separate overlay.`;

    // Side list grouped by country
    const countries = {};
    N.inst.forEach(i => (countries[i.country || i.cc] ||= []).push(i));
    if (list) Object.entries(countries).sort((a, b) => b[1].length - a[1].length).forEach(([cn, arr]) => {
      const li = el("li", null, `<div class="nl-country">${esc(cn)}<span>${arr.length}</span></div>`);
      const ul = el("ul");
      arr.sort((a, b) => a.n.localeCompare(b.n)).forEach(i => {
        const b = el("button", { type: "button", class: "nl-item" }, `${esc(i.n)}<small>${esc(i.c)}</small>`);
        b.addEventListener("click", () => { const city = byCity.get(`${i.c}|${i.cc}`); select(city); flyTo(city); });
        ul.appendChild(el("li")).appendChild(b);
      });
      li.appendChild(ul); list.appendChild(li);
    });
    const partners = c => C.filter(o => o !== c && [...o.papers].some(p => c.papers.has(p)) && (o.c !== c.c || o.cc !== c.cc));
    function showDetail(c) {
      if (!detail) return;
      if (!c) { detail.innerHTML = `<p class="nd-empty">Select a point on the globe or a name below to see co-authors and shared papers.</p>`; return; }
      const papers = [...c.papers].map(k => P[k]).filter(Boolean).sort((a, b) => b.y - a.y);
      detail.innerHTML = `<div class="nd-head"><strong>${esc(c.c)}</strong><span>${esc(c.country)}</span><button type="button" class="nd-close" aria-label="Clear selection">×</button></div>
        <ul class="nd-inst">${c.inst.map(i => `<li>${esc(i.n)}</li>`).join("")}</ul>
        ${c.people.length ? `<p class="nd-k">Co-authors</p><p class="nd-people">${c.people.map(esc).join(", ")}</p>` : `<p class="nd-k">My affiliation on these papers</p>`}
        ${partners(c).length ? `<p class="nd-k">Shared papers with</p><ul class="nd-inst">${partners(c).map(o => `<li>${o.inst.map(i => esc(i.n)).join(", ")} <span class="nd-sub">${esc(o.c)}, ${esc(o.country)}</span></li>`).join("")}</ul>` : ""}
        <p class="nd-k">Papers</p><ul class="nd-papers">${papers.map(p => `<li>${esc(p.t)} <span>${esc(p.v)}, ${p.y}</span></li>`).join("")}</ul>`;
      $(".nd-close", detail).addEventListener("click", () => select(null));
    }

    // Globe
    const proj = d3.geoOrthographic().clipAngle(90).precision(0.6);
    const path = d3.geoPath(proj, ctx);
    const grat = d3.geoGraticule10();
    const sphere = { type: "Sphere" };
    const HOME_ROT = [-58, -27, 0];
    let rot = HOME_ROT.slice(), zoom = 1, W = 0, H = 0, R = 0, dpr = 1;
    let feats = null, borders = null, land = null, coreSet = new Set(N.coreCountryIds || []), gbdSet = new Set((N.gbd && N.gbd.countryIds) || []);
    let showG = false, hover = null, sel = null, running = false, raf = 0, last = 0, idleUntil = 0, fly = null;
    function resize() {
      const r = stage.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) / 2 - 18; applyProj();
    }
    function applyProj() { proj.scale(R * zoom).translate([W / 2, H / 2]).rotate(rot); }
    const center = () => [-rot[0], -rot[1]];
    const visible = ll => d3.geoDistance(ll, center()) < Math.PI / 2 - 0.02;
    function draw(now) {
      applyProj();
      ctx.clearRect(0, 0, W, H);
      const s = proj.scale(), [cx, cy] = proj.translate();
      const glow = ctx.createRadialGradient(cx, cy, s * 0.9, cx, cy, s * 1.18);
      glow.addColorStop(0, "rgba(110,170,255,0.18)"); glow.addColorStop(1, "rgba(110,170,255,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, s * 1.18, 0, 6.283); ctx.fill();
      const ocean = ctx.createRadialGradient(cx - s * 0.35, cy - s * 0.4, s * 0.1, cx, cy, s);
      ocean.addColorStop(0, "#2a5aa6"); ocean.addColorStop(1, "#163872");
      ctx.beginPath(); path(sphere); ctx.fillStyle = ocean; ctx.fill();
      ctx.beginPath(); path(grat); ctx.lineWidth = 0.5; ctx.strokeStyle = "rgba(142,197,255,0.08)"; ctx.stroke();
      if (feats) {
        ctx.beginPath(); path(land); ctx.fillStyle = "#3a5f98"; ctx.fill();
        for (const f of feats) {
          const g = showG && gbdSet.has(f.id), c = coreSet.has(f.id);
          if (!g && !c) continue;
          ctx.beginPath(); path(f); ctx.fillStyle = c ? "rgba(110,170,255,0.32)" : "rgba(255,197,107,0.18)"; ctx.fill();
        }
        ctx.beginPath(); path(borders); ctx.lineWidth = 0.5; ctx.strokeStyle = "rgba(180,205,235,0.22)"; ctx.stroke();
      }
      ctx.beginPath(); path(sphere); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(142,197,255,0.4)"; ctx.stroke();
      if (showG && N.gbd) {
        ctx.fillStyle = "rgba(255,197,107,0.78)"; ctx.beginPath();
        for (const [la, lo, n] of N.gbd.points) { if (!visible([lo, la])) continue; const p = proj([lo, la]); const rr = 1.1 + Math.sqrt(n) * 0.55; ctx.moveTo(p[0] + rr, p[1]); ctx.arc(p[0], p[1], rr, 0, 6.283); }
        ctx.fill();
      }
      const tt = (now || 0) / 1000;
      for (const a of arcs) {
        const hot = sel && ((sel.lng === a.A[0] && sel.lat === a.A[1]) || (sel.lng === a.B[0] && sel.lat === a.B[1]));
        ctx.beginPath(); path({ type: "LineString", coordinates: [a.A, a.B] });
        ctx.lineWidth = hot ? 2 : 1 + (a.n > 1 ? 0.6 : 0); ctx.strokeStyle = hot ? "rgba(255,255,255,0.85)" : a.home ? "rgba(228,107,220,0.55)" : "rgba(142,197,255,0.55)"; ctx.stroke();
        if (!reduced) {
          for (let k = 0; k < 2; k++) {
            const t = (tt * 0.22 + a.off + k * 0.5) % 1, ll = a.ip(t);
            if (!visible(ll)) continue;
            const p = proj(ll); ctx.beginPath(); ctx.arc(p[0], p[1], 2.1, 0, 6.283); ctx.fillStyle = a.home ? "#F3A6EE" : "#DCEBFF"; ctx.fill();
          }
        }
      }
      for (const c of C) {
        const ll = [c.lng, c.lat]; if (!visible(ll)) { c.px = null; continue; }
        const p = proj(ll); c.px = p;
        const col = c.home ? "#E46BDC" : "#8EC5FF";
        if (c.home && !reduced) { const ph = (tt % 2) / 2; ctx.beginPath(); ctx.arc(p[0], p[1], c.r + ph * 16, 0, 6.283); ctx.strokeStyle = `rgba(228,107,220,${0.6 * (1 - ph)})`; ctx.lineWidth = 1.5; ctx.stroke(); }
        ctx.beginPath(); ctx.arc(p[0], p[1], c.r + 4, 0, 6.283); ctx.fillStyle = c.home ? "rgba(228,107,220,0.18)" : "rgba(142,197,255,0.18)"; ctx.fill();
        ctx.beginPath(); ctx.arc(p[0], p[1], c.r, 0, 6.283); ctx.fillStyle = col; ctx.fill();
        if (c === sel || c === hover) { ctx.beginPath(); ctx.arc(p[0], p[1], c.r + 3, 0, 6.283); ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke(); }
      }
      if (sel && sel.px) {
        ctx.font = "600 13px 'IBM Plex Sans', sans-serif"; ctx.fillStyle = "#fff"; ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,.8)"; ctx.shadowBlur = 6; ctx.fillText(sel.c, sel.px[0] + sel.r + 8, sel.px[1]); ctx.shadowBlur = 0;
      }
    }
    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (fly) {
        const k = Math.min(1, (now - fly.t0) / fly.dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        rot = [fly.from[0] + fly.d[0] * e, fly.from[1] + fly.d[1] * e, 0]; if (k >= 1) fly = null;
      } else if (!dragging && !hover && now > idleUntil && !reduced) rot[0] += 5 * dt;
      draw(now); raf = requestAnimationFrame(frame);
    }
    function flyTo(c) {
      const to = [-c.lng, -Math.max(-60, Math.min(60, c.lat))];
      let d0 = ((to[0] - rot[0]) % 360 + 540) % 360 - 180;
      fly = { from: rot.slice(), d: [d0, to[1] - rot[1]], t0: performance.now(), dur: reduced ? 1 : 900 };
      idleUntil = performance.now() + 8000; if (!running) { rot = [rot[0] + d0, to[1], 0]; fly = null; draw(0); }
    }
    function select(c) { sel = c; showDetail(c); idleUntil = performance.now() + (c ? 1e9 : 1500); if (!running) draw(0); }
    function pick(x, y) { let best = null, bd = 14; for (const c of C) { if (!c.px) continue; const d = Math.hypot(c.px[0] - x, c.px[1] - y); if (d < bd + c.r * 0.5) { bd = d; best = c; } } return best; }
    let dragging = false, downAt = null, rot0 = null, moved = 0;
    canvas.addEventListener("pointerdown", e => { dragging = true; moved = 0; downAt = [e.clientX, e.clientY]; rot0 = rot.slice(); fly = null; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", e => {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (dragging) {
        const k = 0.28 / zoom, dx = e.clientX - downAt[0], dy = e.clientY - downAt[1]; moved = Math.max(moved, Math.hypot(dx, dy));
        rot = [rot0[0] + dx * k, Math.max(-75, Math.min(75, rot0[1] - dy * k)), 0]; idleUntil = performance.now() + 4000; if (!running) draw(0); return;
      }
      const h = pick(x, y);
      if (h !== hover) { hover = h; canvas.style.cursor = h ? "pointer" : "grab"; }
      if (h && tip) { tip.hidden = false; tip.innerHTML = `<strong>${esc(h.c)}</strong> · ${esc(h.country)}<br>${h.inst.map(i => esc(i.n)).join("<br>")}`; tip.style.left = Math.min(W - 230, x + 14) + "px"; tip.style.top = (y + 14) + "px"; }
      else if (tip) tip.hidden = true;
    });
    const end = e => { if (!dragging) return; dragging = false; if (moved < 5) { const r = canvas.getBoundingClientRect(); const h = pick(e.clientX - r.left, e.clientY - r.top); select(h || null); if (h) flyTo(h); } };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", () => { dragging = false; });
    canvas.addEventListener("pointerleave", () => { hover = null; if (tip) tip.hidden = true; });
    $$("[data-zoom]", stage).forEach(b => b.addEventListener("click", () => { zoom = Math.max(0.8, Math.min(3.2, zoom * (b.dataset.zoom === "1" ? 1.3 : 1 / 1.3))); if (!running) draw(0); }));
    const rb = $("[data-reset]", stage); if (rb) rb.addEventListener("click", () => { zoom = 1; select(null); const d0 = ((HOME_ROT[0] - rot[0]) % 360 + 540) % 360 - 180; fly = { from: rot.slice(), d: [d0, HOME_ROT[1] - rot[1]], t0: performance.now(), dur: 800 }; if (!running) { rot = HOME_ROT.slice(); fly = null; draw(0); } });
    if (tog) tog.addEventListener("change", () => { showG = tog.checked; const li = $(".lg-gbd-item", stage); if (li) li.hidden = !showG; if (showG && zoom > 1) zoom = 1; if (!running) draw(0); });
    canvas.style.cursor = "grab";
    showDetail(null);
    const start = () => { if (running || reduced) return; running = true; last = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    resize(); draw(0);
    fetch("/assets/data/countries-110m.json").then(r => r.json()).then(topo => {
      feats = topojson.feature(topo, topo.objects.countries).features;
      land = topojson.feature(topo, topo.objects.land);
      borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
      draw(0);
    }).catch(() => {});
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { resize(); draw(0); }, 120); });
    if ("IntersectionObserver" in window) new IntersectionObserver(en => { en[0].isIntersecting ? start() : stop(); }, { threshold: 0.05 }).observe(canvas); else start();
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
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
