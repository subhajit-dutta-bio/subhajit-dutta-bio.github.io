/* ============================================================
   MEDIA — figures, posters, talk photos, portraits, documents.
   Put files in assets/img/ (images) or assets/pdf/ (documents), then add one entry per file.

   Fields:
     src      path to the file, e.g. "/assets/img/math-schematic.png"
     type     "image" (default) or "pdf"
     caption  one sentence; shown on hover and in the lightbox
     group    figures | posters | talks | portraits | documents   (gallery filter)
     wide     true for landscape items that deserve a double-width tile
     credit   optional source line, e.g. "Figure 1, Author et al., Journal 2026 (CC BY 4.0)"
     link     optional URL for the credit (usually the DOI)
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
  {src:"/assets/img/fig/fig-telomere-elife2024.webp", w:1200, h:947, caption:"Short telomeres leave more TRF2 free to bind the IL1R1 promoter, raising IL-1 signalling and M2 macrophage infiltration; long telomeres keep IL1R1 low.", credit:"Graphical summary, Mukherjee, Dutta et al., eLife 2024 (CC BY 4.0)", link:"https://doi.org/10.7554/eLife.95106", group:"figures", theme:"telomere", wide:true},
  {src:"/assets/img/fig/fig-imaging-fcell2026.webp", w:1400, h:783, caption:"Invasion modes, how mechanical and EMT descriptions relate, and a hierarchy of mechanical observables from actin polarity to defect topology.", credit:"Figure 1, Dutta and Sulava, Front. Cell Dev. Biol. 2026 (CC BY 4.0)", link:"https://doi.org/10.3389/fcell.2026.1930678", group:"figures", theme:"imaging", wide:true},
  {src:"/assets/img/fig/fig-pancancer-biorxiv2026.webp", w:1028, h:1280, caption:"In melanoma spatial transcriptomics, inferred chromosomal-instability-like fields coincide with antigen-presentation-low, immune-cold neighbourhoods.", credit:"Figure 1, Dutta, bioRxiv 2026 (CC BY-NC-ND 4.0)", link:"https://doi.org/10.64898/2026.05.15.725574", group:"figures", theme:"pancancer"},
  {src:"/assets/img/talk-3mt-2026.webp", caption:"Speaking at the Hamburg Three Minute Thesis Competition, Hamburg Research Academy, August 2026.", group:"talks", wide:true},
  {src:"/assets/img/talk-3mt-2026-stage.webp", caption:"How mitochondria help cancer cells metastasise: carrying ribosomes to the cell front for local translation. Hamburg Three Minute Thesis Competition, 2026.", group:"talks", theme:"math", wide:true},
  {src:"/assets/img/portrait.webp", caption:"Subhajit Dutta, portrait, 2026.", group:"portraits"}
];

window.SITE.mediaGroups = [
  ["all", "All"],
  ["figures", "Figures"],
  ["posters", "Posters"],
  ["talks", "Talks"],
  ["portraits", "Portraits"],
  ["documents", "Documents"]
];
