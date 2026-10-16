# Personal website — how it works and how to launch it

Static site, no build step. Seven pages share one stylesheet (`assets/site.css`) and one script (`assets/site.js`).
All content you will ever change lives in `assets/data/`:

| File | What it holds |
|---|---|
| `profile.js` | **Edit first.** Site address, headshot, CV PDF, profile links, Web3Forms key, GoatCounter code, postal address for the Impressum |
| `publications.js` | Every paper, preprint, review, patent. One object per entry; DOIs become links, BibTeX is generated |
| `news.js` | Dated updates. Home page shows the three newest |
| `talks.js` | Talks, posters, awards. Optional slides/poster/photo per entry |
| `media.js` | Figures, posters, photos, portraits, PDFs for the Media gallery and the Research page |

Page text (bio, research narratives, methods, collaboration offer) is plain HTML in each `index.html`.

## 1. Before launch (30 minutes)

1. **Site address.** Search every file for `REPLACE-ME` and replace with your real address, e.g. `https://yourname.github.io/`. Also set `siteUrl` in `profile.js`.
2. **Form.** Go to web3forms.com, enter `dsubhajit.edu@gmail.com`, copy the access key they email you, paste it as `web3formsKey` in `profile.js`. Messages then arrive in Gmail with the subject `[Website] <topic>: <name>`. Add a Gmail filter on that subject if you want a label.
3. **Analytics.** Sign up at goatcounter.com (free), choose a code such as `subhajitdutta`, put it in `goatcounter` in `profile.js`. Leave empty to disable.
4. **Headshot.** Save a 4:5 portrait (around 1200×1500 px, under 300 KB) as `assets/img/portrait.jpg` and set `photo: "/assets/img/portrait.jpg"`.
5. **CV.** Save as `assets/pdf/CV_Subhajit_Dutta.pdf`, set `cvPdf` in `profile.js`.
6. **Links.** Fill `links` in `profile.js` (Scholar, GitHub, LinkedIn…). Empty ones are hidden.
7. **Impressum.** Fill `legal.address` in `profile.js`. A professional website operated from Germany needs one.
8. **Fonts — done.** Fraunces and IBM Plex Sans are self-hosted in `assets/fonts/` (no Google request). Old note: The pages load Fraunces and IBM Plex Sans from Google Fonts. German courts have treated this as needing consent. To self-host instead: download both families from gwfh.mranftl.com (Google Webfonts Helper) into `assets/fonts/`, paste the generated `@font-face` CSS at the top of `assets/site.css`, and delete the three `fonts.googleapis.com` lines from each `index.html`. Then update the Fonts paragraph in `legal/index.html`.

## 2. Host free on GitHub Pages

1. Create a public repository named exactly `<username>.github.io`.
2. Upload everything in this folder to the repository root (keep the folder structure).
3. Settings → Pages → Source "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Live at `https://<username>.github.io/` within minutes. The pages use root-relative paths (`/assets/...`), which is why the repo must be the user site, not a project repo.

Custom domain (optional, ~€10/year): add a file named `CNAME` containing the domain, set DNS as Settings → Pages instructs, then update `REPLACE-ME` to the domain.

## 3. Get found

1. Google Search Console → add property → verify with the HTML-tag method (paste their `<meta>` into `<head>` of `index.html`).
2. Submit `/sitemap.xml`. Request indexing for the home page and `/publications/`.
3. Bing Webmaster Tools → import from Search Console.
4. Add the URL to ORCID, Google Scholar, GitHub, LinkedIn, ResearchGate, bioRxiv author profile, your UKE staff page, and your email signature. These backlinks are what make the site rank for your name.
5. Post a News entry whenever something happens. Dated activity is the strongest freshness signal.

## 4. Adding things later

- **New paper:** add an object at the top of the matching group in `publications.js`. Set `featured: true` on up to three you want on the home page.
- **Figure or photo:** resize (`mogrify -resize 2000x2000\> -quality 82 file.jpg`), drop into `assets/img/`, add an entry to `media.js`. Give it `theme: "math"` (or telomere, imaging, pancancer) and it also appears beside that theme on the Research page.
- **Paper PDF:** only for CC-BY papers (Frontiers, eLife, PLoS, bioRxiv). Put it in `assets/pdf/` and add `pdf: "/assets/pdf/...pdf"` to that entry. Do not host the Nature Reviews pieces, JBSD or JAMA Cardiology; link to them.
- **Talk with slides:** add `slides: "/assets/pdf/..."` to the entry in `talks.js`.
- Update `<lastmod>` in `sitemap.xml` after substantive changes.

## 5. Checking locally

Open a terminal in this folder and run `python3 -m http.server 8000`, then visit `http://localhost:8000/`. Opening `index.html` directly from the file system will not load the root-relative assets.
