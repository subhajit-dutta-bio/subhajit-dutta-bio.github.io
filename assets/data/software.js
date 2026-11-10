/* ============================================================
   SOFTWARE — public repositories shown on /software/.
   Only list code that is already public on GitHub.
   Fields: name, repo (owner/name), what (one line), lang, licence (optional),
           doi (optional Zenodo DOI), group (methods | genomics | migration), paper (optional link)
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.softwareGroups = [
  ["methods", "Spatial and imaging methods"],
  ["genomics", "Genomics and gene regulation"],
  ["migration", "Cell migration"]
];
window.SITE.software = [
  {name:"WEFT", repo:"subhajit-dutta-bio/weft-spatial", group:"methods", lang:"Python", what:"Orientation fields of spatial gene expression and how they align with the tissue's own fabric."},
  {name:"DYNLL1 nuclear alignment", repo:"subhajit-dutta-bio/dynll1-u2os-nuclear-alignment", group:"methods", lang:"Python", what:"Reproducible analysis of local nuclear alignment after DYNLL1 targeting in U2OS cells, with the accompanying telomeric 12q pattern."},
  {name:"MitoTemporal", repo:"subhajit-dutta-bio/MitoTemporal", group:"genomics", lang:"Python", what:"Analysis code showing that mitochondrial import transcription tracks oestrogen-receptor activity in breast cancer. Code only; no datasets."},
  {name:"EnhancerForge v1.0", repo:"subhajit-dutta-bio/EnhancerForge-v1.0", group:"genomics", what:"Cell-type-specific enhancer design by grammar-constrained sequence optimisation."},
  {name:"Cell Migration Analysis Pipeline", repo:"subhajit-dutta-bio/Cell-Migration-Analysis-Pipeline", group:"migration", lang:"Python · Jupyter / Colab", licence:"MIT", what:"Turns TrackMate track tables into per-cell speed, displacement, directionality, MSD and turning angles, with rose plots, movies and automatic statistical comparison between conditions."},
  {name:"Cell Track Analyzer (CTA)", repo:"subhajit-dutta-bio/CTA", group:"migration", lang:"Python · Jupyter", what:"Reads TrackMate cell-migration data and reports the main migration parameters per track."}
];
