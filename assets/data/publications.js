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
     featured  true to show on the home page (max 3 are used)
     tags      optional list of theme keys: math | telomere | imaging | pancancer
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.pubs = [
  /* ---- Peer-reviewed ---- */
  {type:"paper", status:"accepted", year:2026, title:"The mitochondrion as a mechanometabolic conductor of cancer metastasis: pharmacological insights from the mitochondria–peroxisome interface", authors:"<b>Dutta S</b>, Maity N", venue:"Frontiers in Pharmacology", note:"Review, accepted", tags:["math"]},
  {type:"paper", status:"published", year:2026, title:"Covariate-adjusted AP-1 motif architecture and footprinting track olaparib-adaptive chromatin remodelling", authors:"<b>Dutta S</b>", venue:"Frontiers in Systems Biology", doi:"10.3389/fsysb.2026.1859256", tags:["pancancer"]},
  {type:"paper", status:"published", year:2026, title:"Mechanical observables of cancer invasion: actin, adhesion, and metastatic plasticity", authors:"<b>Dutta S</b>, Sulava S", venue:"Frontiers in Cell and Developmental Biology", doi:"10.3389/fcell.2026.1930678", tags:["imaging"]},
  {type:"paper", status:"published", year:2026, title:"Beyond static biomarkers: systems biology and AI for decoding cancer dynamics", authors:"<b>Dutta S</b>, Goli A", venue:"Frontiers in Systems Biology, 6", doi:"10.3389/fsysb.2026.1855016", tags:["pancancer"]},
  {type:"paper", status:"published", year:2025, title:"Telomeres control human telomerase (TERT) expression through non-telomeric TRF2", authors:"Sengupta A, Vinayagamurthy S, Soni D, Deb R, Mukherjee AK, <b>Dutta S</b>, et al.", venue:"eLife, 14, RP104045", url:"https://elifesciences.org/articles/104045", featured:true, tags:["telomere"]},
  {type:"paper", status:"published", year:2024, title:"Telomere length-sensitive regulation of IL1R1 by the shelterin protein TRF2 modulates immune signalling in the tumour microenvironment", authors:"Mukherjee AK*, <b>Dutta S*</b>, Singh A, Sharma S, Roy SS, Sengupta A, et al.", venue:"eLife, 13, RP95106", url:"https://elifesciences.org/articles/95106", note:"*Co-first author", featured:true, tags:["telomere"]},
  {type:"paper", status:"published", year:2020, title:"Structural analysis, molecular docking and molecular dynamics simulations of GPCR (kisspeptin) in fish", authors:"Rather MA, <b>Dutta S</b>, Guttula PK, et al.", venue:"Journal of Biomolecular Structure and Dynamics, 38(8), 2422–2439"},
  {type:"paper", status:"published", year:2019, title:"Optimization of extraction of antioxidant polysaccharide from Pleurotus ostreatus and its cytotoxic activity against murine lymphoid cancer cell line", authors:"Uddin PK, Islam MS, Pervin R, <b>Dutta S</b>, et al.", venue:"PLoS One, 14(1), e0209371", doi:"10.1371/journal.pone.0209371"},
  {type:"paper", status:"published", year:2018, title:"Enzyme inhibitory and antioxidant activity of combination of two edible mushrooms of Ganoderma lucidum and Pleurotus ostreatus", authors:"Uddin PK, Islam MS, Pervin R, <b>Dutta S</b>, et al.", venue:"Tropical Journal of Natural Product Research, 2(7), 314–319"},
  {type:"paper", status:"published", year:2018, title:"Uncovering the selective drug targets in urethane-mediated lung cancer through network approach", authors:"Fatoki TH, <b>Dutta S</b>, Oyedele AS", venue:"Journal of Applied Life Sciences International, 19(2), 1–12"},

  /* ---- Under review / in preparation ---- */
  {type:"review", status:"under review", year:2026, title:"Cell-type-resolved senescence and telomere-maintenance programs reveal distinct axes of human immune aging", authors:"<b>Dutta S</b>", venue:"Frontiers in Aging", note:"Original research", tags:["telomere"]},
  {type:"review", status:"under review", year:2026, title:"Expression-parameterized mechanotransduction ODE predicts ultrasensitive membrane mechanosensor states and compartmentalized YAP regulation in breast cancer", authors:"<b>Dutta S</b>", venue:"Frontiers in Biophysics", note:"Original research", tags:["math"]},
  {type:"review", status:"under review", year:2026, title:"From molecular sieve to precision target: VDAC1 functional states in cancer", authors:"<b>Dutta S</b>, Maity N", venue:"The Journal of Precision Medicine: Health and Disease", note:"Review", tags:["math"]},
  {type:"review", status:"under review", year:2026, title:"Temporal order separates generic persistence from cue-directed commitment in cell migration", authors:"<b>Dutta S</b>", venue:"Frontiers in Cell and Developmental Biology", preprint:"10.64898/2026.07.16.739021", note:"Original research", featured:true, tags:["imaging"]},
  {type:"review", status:"under review", year:2026, title:"Telomere–mitochondrial crosstalk in cellular senescence and ageing: revisiting the Hayflick limit", authors:"<b>Dutta S</b>, Banik A, Goli A", venue:"Frontiers in Aging", note:"Review", tags:["telomere","math"]},
  {type:"review", status:"under review", year:2026, title:"Actin nematic organisation in breast cancer: structural and dynamic cell phenotypes and a tumour-associated actomyosin programme", authors:"<b>Dutta S</b>, Failla AV", venue:"Frontiers in Cell and Developmental Biology", note:"Original research", tags:["imaging"]},
  {type:"review", status:"submitted", year:2026, title:"Healthy-organ immune baselines are associated with tumour immune load across human cancers", authors:"<b>Dutta S</b>, Banik A, Uddin PK", venue:"Immunology (Wiley)", note:"Original article", tags:["pancancer"]},
  {type:"review", status:"under review", year:2026, title:"Mitochondrial allocation in cancer metastasis", authors:"<b>Dutta S</b>, Maity N, Sulava S", venue:"Seminars in Cancer Biology", note:"Invited review", tags:["math"]},
  {type:"review", status:"in preparation", year:2026, title:"Mechanobiology of actin, mitochondria and metastasis", authors:"<b>Dutta S</b>, Sulava S, Banik A", venue:"Cancer and Metastasis Reviews, Mechanobiology collection", note:"Invited review", tags:["math","imaging"]},

  /* ---- Preprints ---- */
  {type:"preprint", status:"published", year:2026, title:"A replicated patient-specific component of tumour telomere length across two pan-cancer cohorts", authors:"<b>Dutta S</b>", venue:"bioRxiv", doi:"10.64898/2026.08.31.748414", tags:["telomere","pancancer"]},
  {type:"preprint", status:"published", year:2026, title:"Transcriptome-inferred CIN-like fields mark antigen-presentation-low, immune-cold spatial neighborhoods", authors:"<b>Dutta S</b>", venue:"bioRxiv", doi:"10.64898/2026.05.15.725574", tags:["pancancer"]},
  {type:"preprint", status:"published", year:2026, title:"A pan-cancer regulatory atlas of 6,983 GWAS variants prioritizes recurrent regulatory annotations and candidate programs at cancer risk loci", authors:"<b>Dutta S</b>", venue:"medRxiv", doi:"10.64898/2026.05.16.26353369", tags:["pancancer"]},

  /* ---- Nature Reviews journal club ---- */
  {type:"commentary", status:"published", year:2026, title:"Missing marks made visible", authors:"<b>Dutta S</b>", venue:"Nature Reviews Chemistry", doi:"10.1038/s41570-026-00861-4", note:"Journal club"},
  {type:"commentary", status:"published", year:2026, title:"CD38 as a driver of ageing: metabolism", authors:"<b>Dutta S</b>", venue:"Nature Reviews Endocrinology, 22(3), 137", note:"Journal club"},
  {type:"commentary", status:"published", year:2024, title:"Watching RNA in action with a green lantern", authors:"<b>Dutta S</b>", venue:"Nature Reviews Chemistry, 8(9), 651", note:"Journal club"},
  {type:"commentary", status:"published", year:2023, title:"Unveiling the telomere–p53–PGC ageing axis", authors:"<b>Dutta S</b>", venue:"Nature Reviews Endocrinology, 19(12), 686", note:"Journal club"},

  /* ---- Book chapter ---- */
  {type:"chapter", status:"under review", year:2026, title:"Integrating histopathology with genomic data", authors:"<b>Dutta S</b>, Sulava S", venue:"Digital Pathology: Methods and Protocols (Methods in Molecular Biology), Springer Nature", note:"Invited chapter", tags:["pancancer"]},

  /* ---- Patent ---- */
  {type:"patent", status:"published", year:2024, title:"Recombinant construct for cancer treatment: targeted silencing of IL1R1 via a dCas9–TRF2 fusion protein", authors:"<b>Dutta S</b> (lead inventor), Chowdhury S, Mukherjee AK, Roy SS, et al.", venue:"US Patent Application US20240117359A1; Indian Patent Application IN202211019412", url:"https://patents.google.com/patent/US20240117359A1", note:"Patent application", tags:["telomere"]},

  /* ---- GBD consortium ---- */
  {type:"consortium", status:"published", year:2026, title:"Global, regional, and national burden of heart failure, 1990–2023: a systematic analysis for the Global Burden of Disease Study 2023", authors:"GBD 2023 Heart Failure Collaborators (incl. <b>Dutta S</b>)", venue:"JAMA Cardiology", doi:"10.1001/jamacardio.2026.4068"},
  {type:"consortium", status:"under review", year:2026, title:"Global, regional, and national burden of osteoarthritis in 204 countries and territories, 1990–2023", authors:"GBD 2023 Osteoarthritis Collaborators", venue:"The BMJ", note:"Revised version under review"},
  {type:"consortium", status:"under review", year:2026, title:"Global, regional, and national burden of gallbladder and biliary diseases in 204 countries and territories, 1990–2023", authors:"GBD 2023 Gallbladder and Biliary Diseases Collaborators", venue:"The Lancet Gastroenterology & Hepatology", note:"Revised version under review"}
];

window.SITE.pubTypes = [
  ["all", "All"],
  ["paper", "Peer-reviewed"],
  ["review", "Under review"],
  ["preprint", "Preprints"],
  ["commentary", "Nature Reviews"],
  ["chapter", "Book chapter"],
  ["patent", "Patent"],
  ["consortium", "GBD consortium"]
];
