/* ============================================================
   PUBLICATIONS — add a new entry at the top of the matching group.
   Fields:
     type:     paper | review | preprint | commentary | chapter | patent | consortium
               ("review" here means "under review / in preparation", as on the CV)
     status:   published | accepted | under review | submitted | in preparation
     year, title, authors (use <b>Dutta S</b> for yourself), venue
     doi       optional, bare DOI (no https://)
     url       optional, overrides the DOI link
     pdf       optional, e.g. "/assets/pdf/dutta-2024-elife.pdf" — only for open-licence papers (CC-BY)
     preprint  optional, bare DOI of the preprint version
     note      optional, shown in small type
     take      optional one-line plain-language takeaway
     featured  true to show on the home page (max 3 are used)
     tags      optional list of theme keys: math | telomere | imaging | pancancer
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.pubs = [
  /* ---- Peer-reviewed ---- */
  {type:"paper", status:"published", year:2026, title:"The mitochondrion as a mechanometabolic conductor of cancer metastasis: pharmacological insights from the mitochondria–peroxisome interface", authors:"<b>Dutta S</b>, Maity N", venue:"Frontiers in Pharmacology, 17, 1983363", doi:"10.3389/fphar.2026.1983363", tags:["math"], take:"Reviews how the interface between mitochondria and peroxisomes couples metabolism and mechanics during metastasis, and what that implies for drug targeting."},
  {type:"paper", status:"published", year:2026, title:"Covariate-adjusted AP-1 motif architecture and footprinting track olaparib-adaptive chromatin remodelling", authors:"<b>Dutta S</b>", venue:"Frontiers in Systems Biology, 6, 1859256", doi:"10.3389/fsysb.2026.1859256", tags:["pancancer"], take:"In ovarian cancer cells adapting to the PARP inhibitor olaparib, newly opened chromatin carries more AP-1 motifs and footprints after correcting for sequence and accessibility biases: a robust association, not proof of AP-1 binding."},
  {type:"paper", status:"published", year:2026, title:"Mechanical observables of cancer invasion: actin, adhesion, and metastatic plasticity", authors:"<b>Dutta S</b>, Sulava S", venue:"Frontiers in Cell and Developmental Biology, 14, 1930678", doi:"10.3389/fcell.2026.1930678", tags:["imaging"], take:"A critical review of which mechanical measurements of invasion, from actin order to traction and unjamming, add information beyond EMT state and histology, and where common measurements are conflated."},
  {type:"paper", status:"published", year:2026, title:"Beyond static biomarkers: systems biology and AI for decoding cancer dynamics", authors:"<b>Dutta S</b>, Goli A", venue:"Frontiers in Systems Biology, 6, 1855016", doi:"10.3389/fsysb.2026.1855016", tags:["pancancer"], take:"Argues that cancer biomarkers should estimate transition risk and trajectory rather than only the current state, and sets out a stochastic state-space framework for doing so."},
  {type:"paper", status:"published", year:2025, title:"Telomeres control human telomerase (TERT) expression through non-telomeric TRF2", authors:"Sengupta A, Vinayagamurthy S, Soni D, Deb R, Mukherjee AK, <b>Dutta S</b>, et al.", venue:"eLife, 14, RP104045", url:"https://elifesciences.org/articles/104045", featured:true, tags:["telomere"], take:"Telomere length feeds back on telomerase itself: TRF2 bound at the <i>TERT</i> promoter, away from telomeres, recruits PRC2 to repress <i>TERT</i>, and how much TRF2 binds there depends on telomere length."},
  {type:"paper", status:"published", year:2024, title:"Telomere length-sensitive regulation of IL1R1 by the shelterin protein TRF2 modulates immune signalling in the tumour microenvironment", authors:"Mukherjee AK*, <b>Dutta S*</b>, Singh A, Sharma S, Roy SS, Sengupta A, et al.", venue:"eLife, 13, RP95106", url:"https://elifesciences.org/articles/95106", note:"*Co-first author", featured:true, tags:["telomere"], take:"Short telomeres increase TRF2 binding at the <i>IL1R1</i> promoter, which recruits p300 and switches on IL-1 receptor signalling; in triple-negative breast cancer this tracks with macrophage infiltration."},
  {type:"paper", status:"published", year:2020, title:"Structural analysis, molecular docking and molecular dynamics simulations of GPCR (kisspeptin) in fish", authors:"Rather MA, <b>Dutta S</b>, Guttula PK, et al.", venue:"Journal of Biomolecular Structure and Dynamics, 38(8), 2422–2439", doi:"10.1080/07391102.2019.1633407", take:"Homology modelling, docking and molecular dynamics of the fish kisspeptin receptor to identify candidate agonist ligands."},
  {type:"paper", status:"published", year:2019, title:"Optimization of extraction of antioxidant polysaccharide from Pleurotus ostreatus and its cytotoxic activity against murine lymphoid cancer cell line", authors:"Uddin PK, Islam MS, Pervin R, <b>Dutta S</b>, et al.", venue:"PLoS One, 14(1), e0209371", doi:"10.1371/journal.pone.0209371", take:"An optimised extraction of oyster-mushroom polysaccharide that showed antioxidant activity and dose- and time-dependent toxicity to Ehrlich ascites carcinoma cells."},
  {type:"paper", status:"published", year:2018, title:"Enzyme inhibitory and antioxidant activity of combination of two edible mushrooms of Ganoderma lucidum and Pleurotus ostreatus", authors:"Uddin PK, Islam MS, Pervin R, <b>Dutta S</b>, et al.", venue:"Tropical Journal of Natural Product Research, 2(7), 314–319", doi:"10.26538/tjnpr/v2i7.3"},
  {type:"paper", status:"published", year:2018, title:"Uncovering the selective drug targets in urethane-mediated lung cancer through network approach", authors:"Fatoki TH, <b>Dutta S</b>, Oyedele AS", venue:"Journal of Applied Life Sciences International, 19(2), 1–12", doi:"10.9734/JALSI/2018/45097"},

  /* ---- Manuscripts in progress ----
     Anything not yet accepted. Journal names are deliberately left out until acceptance;
     these appear in the collapsed "Manuscripts in progress" list, without DOI or BibTeX.
     When one is accepted, move it to Peer-reviewed with its venue. If a preprint is posted,
     add it under Preprints instead. ---- */
  {type:"review", status:"under review", year:2026, title:"Cell-type-resolved senescence and telomere-maintenance programs reveal distinct axes of human immune aging", authors:"<b>Dutta S</b>", note:"Original research", tags:["telomere"]},
  {type:"review", status:"under review", year:2026, title:"Expression-parameterized mechanotransduction ODE predicts ultrasensitive membrane mechanosensor states and compartmentalized YAP regulation in breast cancer", authors:"<b>Dutta S</b>", note:"Original research", tags:["math"]},
  {type:"review", status:"under review", year:2026, title:"From molecular sieve to precision target: VDAC1 functional states in cancer", authors:"<b>Dutta S</b>, Maity N", note:"Review", tags:["math"]},
  {type:"review", status:"under review", year:2026, title:"Telomere–mitochondrial crosstalk in cellular senescence and ageing: revisiting the Hayflick limit", authors:"<b>Dutta S</b>, Banik A, Goli A", note:"Review", tags:["telomere","math"]},
  {type:"review", status:"under review", year:2026, title:"Actin nematic organisation in breast cancer: structural and dynamic cell phenotypes and a tumour-associated actomyosin programme", authors:"<b>Dutta S</b>, Failla AV", note:"Original research", tags:["imaging"]},
  {type:"review", status:"submitted", year:2026, title:"Healthy-organ immune baselines are associated with tumour immune load across human cancers", authors:"<b>Dutta S</b>, Banik A, Uddin PK", note:"Original research", tags:["pancancer"]},
  {type:"review", status:"under review", year:2026, title:"Mitochondrial allocation in cancer metastasis", authors:"<b>Dutta S</b>, Maity N, Sulava S", note:"Invited review", tags:["math"]},
  {type:"review", status:"in preparation", year:2026, title:"Mechanobiology of actin, mitochondria and metastasis", authors:"<b>Dutta S</b>, Sulava S, Banik A", note:"Invited review", tags:["math","imaging"]},
  {type:"review", status:"under review", year:2026, title:"Integrating histopathology with genomic data", authors:"<b>Dutta S</b>, Sulava S", note:"Invited book chapter", tags:["pancancer"]},
  {type:"review", status:"under review", year:2026, title:"Global, regional, and national burden of osteoarthritis in 204 countries and territories, 1990–2023", authors:"GBD 2023 Osteoarthritis Collaborators", note:"GBD consortium paper, revised version"},
  {type:"review", status:"under review", year:2026, title:"Global, regional, and national burden of gallbladder and biliary diseases in 204 countries and territories, 1990–2023", authors:"GBD 2023 Gallbladder and Biliary Diseases Collaborators", note:"GBD consortium paper, revised version"},

  /* ---- Preprints ---- */
  {type:"preprint", status:"published", year:2026, title:"Temporal order separates generic persistence from cue-directed commitment in cell migration", authors:"<b>Dutta S</b>", venue:"bioRxiv", doi:"10.64898/2026.07.16.739021", note:"Revised version under peer review", featured:true, tags:["imaging"], take:"Comparing each cell track with the same steps reshuffled shows how much persistence comes from the order of movements, separating how much a cell moves from whether it stays committed to an external cue."},
  {type:"preprint", status:"published", year:2026, title:"A replicated patient-specific component of tumour telomere length across two pan-cancer cohorts", authors:"<b>Dutta S</b>", venue:"bioRxiv", doi:"10.64898/2026.08.31.748414", tags:["telomere","pancancer"], take:"Tumour telomere length measured from sequencing partly reflects the patient's own telomere length, replicated in TCGA and PCAWG, so telomere biomarker studies should adjust for matched-normal telomere length."},
  {type:"preprint", status:"published", year:2026, title:"Transcriptome-inferred CIN-like fields mark antigen-presentation-low, immune-cold spatial neighborhoods", authors:"<b>Dutta S</b>", venue:"bioRxiv", doi:"10.64898/2026.05.15.725574", tags:["pancancer"], take:"In melanoma spatial transcriptomics, regions with inferred chromosomal-instability-like signals coincide with low MHC-I antigen presentation and immune-cold neighbourhoods."},
  {type:"preprint", status:"published", year:2026, title:"A pan-cancer regulatory atlas of 6,983 GWAS variants prioritizes recurrent regulatory annotations and candidate programs at cancer risk loci", authors:"<b>Dutta S</b>", venue:"medRxiv", doi:"10.64898/2026.05.16.26353369", tags:["pancancer"], take:"An annotation atlas of 6,983 cancer GWAS variants that ranks likely regulatory variants and points to candidate transcription factors at cancer risk loci."},

  /* ---- Nature Reviews journal club ---- */
  {type:"commentary", status:"published", year:2026, title:"Missing marks made visible", authors:"<b>Dutta S</b>", venue:"Nature Reviews Chemistry", doi:"10.1038/s41570-026-00861-4", note:"Journal club"},
  {type:"commentary", status:"published", year:2026, title:"CD38 as a driver of ageing", authors:"<b>Dutta S</b>", venue:"Nature Reviews Endocrinology, 22(3), 137", doi:"10.1038/s41574-025-01211-y", note:"Journal club"},
  {type:"commentary", status:"published", year:2024, title:"Watching RNA in action with a green lantern", authors:"<b>Dutta S</b>", venue:"Nature Reviews Chemistry, 8(9), 651", note:"Journal club"},
  {type:"commentary", status:"published", year:2023, title:"Unveiling the telomere–p53–PGC ageing axis", authors:"<b>Dutta S</b>", venue:"Nature Reviews Endocrinology, 19(12), 686", note:"Journal club"},


  /* ---- Patent ---- */
  {type:"patent", status:"published", year:2024, title:"Recombinant construct for cancer treatment: targeted silencing of IL1R1 via a dCas9–TRF2 fusion protein", authors:"<b>Dutta S</b> (lead inventor), Chowdhury S, Mukherjee AK, Roy SS, et al.", venue:"US Patent Application US20240117359A1; Indian Patent Application IN202211019412", url:"https://patents.google.com/patent/US20240117359A1", note:"Patent application", tags:["telomere"]},

  /* ---- GBD consortium ---- */
  {type:"consortium", status:"published", year:2026, title:"Global, regional, and national burden of heart failure, 1990–2023: a systematic analysis for the Global Burden of Disease Study 2023", authors:"GBD 2023 Heart Failure Collaborators (incl. <b>Dutta S</b>)", venue:"JAMA Cardiology", doi:"10.1001/jamacardio.2026.4068"},
];

window.SITE.pubTypes = [
  ["all", "All"],
  ["paper", "Peer-reviewed"],
  ["preprint", "Preprints"],
  ["commentary", "Nature Reviews"],
  ["patent", "Patent"],
  ["consortium", "GBD consortium"]
];
