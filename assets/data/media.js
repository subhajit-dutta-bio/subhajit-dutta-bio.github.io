/* ============================================================
   MEDIA — figures, posters, talk photos, portraits, documents.
   Put files in assets/img/ (images) or assets/pdf/ (documents), then add one entry per file.

   Fields:
     src      path to the file, e.g. "/assets/img/math-schematic.png"
     type     "image" (default) or "pdf"
     caption  one sentence; shown on hover and in the lightbox
     group    figures | posters | talks | portraits | documents   (gallery filter)
     wide     true for landscape items that deserve a double-width tile
     theme    optional: math | telomere | imaging | pancancer
              → the research page shows the first image with each theme next to that theme

   Image sizing: keep each image under ~300 KB and ≤ 2000 px on the long edge.
   One-line resize for a folder (ImageMagick): mogrify -resize 2000x2000\> -quality 82 *.jpg
   Only upload figures you own or that are CC-BY licensed (your Frontiers, eLife, PLoS and bioRxiv figures qualify).

   Example entries (delete these and add your own):
   {src:"/assets/img/math-hub.png", caption:"The Mitochondria–Actin–Translation Hub at the leading edge.", group:"figures", theme:"math", wide:true},
   {src:"/assets/img/portrait-2026.jpg", caption:"Portrait, 2026.", group:"portraits"},
   {src:"/assets/pdf/poster-physcell-2026.pdf", type:"pdf", caption:"Poster, EMBO PhysCell 2026.", group:"posters"},
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.media = [
];

window.SITE.mediaGroups = [
  ["all", "All"],
  ["figures", "Figures"],
  ["posters", "Posters"],
  ["talks", "Talks"],
  ["portraits", "Portraits"],
  ["documents", "Documents"]
];
