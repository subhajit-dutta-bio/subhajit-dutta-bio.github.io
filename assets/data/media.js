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
  {src:"/assets/img/fig/fig-mito-peroxisome-fphar2026.webp", w:1400, h:788, caption:"The mitochondria–peroxisome interface as a regulatory layer of mitochondrial mechanometabolism: shared fission machinery, metabolic exchange, redox and lipid control, and quality control with immune signalling, linked to invasion, colonisation, ferroptosis susceptibility and immune state.", credit:"Figure 2, Dutta and Maity, Front. Pharmacol. 2026 (CC BY 4.0)", link:"https://doi.org/10.3389/fphar.2026.1983363", group:"figures", wide:true},
  {src:"/assets/img/fig/ga-migration-biorxiv2026.webp", w:1280, h:1107, caption:"Comparing each cell track with the same steps in shuffled order isolates the persistence that comes from temporal order alone, and shows how MYO10 depletion and collagen change it.", credit:"Graphical overview, Dutta, bioRxiv 2026 (CC BY-NC-ND 4.0)", link:"https://doi.org/10.64898/2026.07.16.739021", group:"figures", theme:"imaging", wide:true},
  {src:"/assets/img/fig/fig-telomere-elife2024.webp", w:1200, h:947, caption:"Short telomeres leave more TRF2 free to bind the IL1R1 promoter, raising IL-1 signalling and M2 macrophage infiltration; long telomeres keep IL1R1 low.", credit:"Graphical summary, Mukherjee, Dutta et al., eLife 2024 (CC BY 4.0)", link:"https://doi.org/10.7554/eLife.95106", group:"figures", theme:"telomere", wide:true},
  {src:"/assets/img/fig/fig-imaging-fcell2026.webp", w:1400, h:783, caption:"Invasion modes, how mechanical and EMT descriptions relate, and a hierarchy of mechanical observables from actin polarity to defect topology.", credit:"Figure 1, Dutta and Sulava, Front. Cell Dev. Biol. 2026 (CC BY 4.0)", link:"https://doi.org/10.3389/fcell.2026.1930678", group:"figures", theme:"imaging", wide:true},
  {src:"/assets/img/fig/fig-pancancer-biorxiv2026.webp", w:1028, h:1280, caption:"In melanoma spatial transcriptomics, inferred chromosomal-instability-like fields coincide with antigen-presentation-low, immune-cold neighbourhoods.", credit:"Figure 1, Dutta, bioRxiv 2026 (CC BY-NC-ND 4.0)", link:"https://doi.org/10.64898/2026.05.15.725574", group:"figures", theme:"pancancer"},
  {src:"/assets/img/fig/ga-tert-elife2025.webp", w:1280, h:1155, caption:"As telomeres shorten, TRF2 moves to the TERT promoter, recruits REST and PRC2, and deposits the repressive H3K27me3 mark; long telomeres keep TRF2 away and TERT on.", credit:"Model figure, Sengupta et al. (incl. Dutta), eLife 2025 (CC BY 4.0)", link:"https://doi.org/10.7554/eLife.104045", group:"figures", theme:"telomere"},
  {src:"/assets/img/fig/ga-telomere-biorxiv2026.webp", w:1280, h:1193, caption:"Tumour telomere length tracks the patient's own matched-normal telomere length in TCGA and replicates in PCAWG with a different estimator.", credit:"Figure 1, Dutta, bioRxiv 2026 (CC BY-NC-ND 4.0)", link:"https://doi.org/10.64898/2026.08.31.748414", group:"figures", theme:"telomere"},
  {src:"/assets/img/fig/ga-gwas-atlas-medrxiv2026.webp", w:1280, h:1015, caption:"A regulatory atlas of 6,983 cancer GWAS variants across 23 cancer types, scored with AlphaGenome and public regulatory annotations to prioritise likely causal variants and target genes.", credit:"Graphical abstract, Dutta, medRxiv 2026 (CC BY-NC-ND 4.0)", link:"https://doi.org/10.64898/2026.05.16.26353369", group:"figures", theme:"pancancer"},
  {src:"/assets/img/fig/ga-dynamics-fsysb2026.webp", w:1400, h:980, caption:"From static biomarkers to cancer as a partially observed, stochastic multiscale system, in which every clinical assay sees only a noisy projection of the underlying state.", credit:"Figure 1, Dutta and Goli, Front. Syst. Biol. 2026 (CC BY 4.0)", link:"https://doi.org/10.3389/fsysb.2026.1855016", group:"figures", theme:"pancancer", wide:true},
  {src:"/assets/img/thesis-2026.webp", w:1122, h:1402, caption:"With my PhD thesis, Mitochondria Associated Translational Hotspots in Cell Migration of Metastatic Breast Cancer, Universität Hamburg, 2026.", group:"portraits"},
  {src:"/assets/img/talk-3mt-2026.webp", caption:"Speaking at the Hamburg Three Minute Thesis Competition, Hamburg Research Academy, August 2026.", group:"talks", wide:true},
  {src:"/assets/img/talk-3mt-2026-stage.webp", caption:"Presenting how mitochondria help cancer cells metastasise at the Hamburg Three Minute Thesis Competition, 2026.", group:"talks", theme:"math", wide:true},
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
