/* ============================================================
   AWARDS, GRANTS, FELLOWSHIPS AND ROLES — shown on /awards/.
   Groups: prize | grant | fellowship | role
   Fields: group; when (display text); sort (YYYY or YYYY-MM, for ordering);
           title; where (optional); note (optional); highlight: true puts it
           in the three cards at the top of the page (use for prizes).
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.awardGroups = [
  ["prize", "Prizes and distinctions"],
  ["grant", "Research and travel grants"],
  ["fellowship", "Fellowships and scholarships"],
  ["role", "Community roles"]
];
window.SITE.awards = [
  // Prizes and distinctions
  {group:"prize", sort:"2026-08", when:"2026", title:"Selected speaker, Three Minute Thesis", where:"Hamburg Research Academy", note:"One of 10 speakers selected from 19 applicants."},
  {group:"prize", sort:"2025-06", when:"2025", title:"Best oral presentation", where:"6th EUGLOH Annual Student Research Conference, University of Porto", highlight:true},
  {group:"prize", sort:"2025-03", when:"2025", title:"Second-best poster", where:"SFB/CRC 1348 Dynamic Cellular Interfaces, Universität Münster", highlight:true},
  {group:"prize", sort:"2022-11", when:"2022", title:"Best oral presentation", where:"49th Annual Conference of the Indian Immunology Society (Immunocon)", highlight:true},
  {group:"prize", sort:"2016", when:"2016", title:"Department Gold Medal", where:"University of Burdwan", note:"First rank, BSc (Hons) Botany."},

  // Research and travel grants
  {group:"grant", sort:"2026", when:"2026", title:"Google TPU Research Cloud award", note:"Compute for foundation-model development."},
  {group:"grant", sort:"2026-12", when:"2025 – 2026", title:"EMBO Travel Grants", where:"ASCB|EMBO Cell Bio 2025 and 2026"},
  {group:"grant", sort:"2025", when:"2025", title:"EUGLOH support grants", where:"EACR 2025 and LAMELIS 2025"},
  {group:"grant", sort:"2024", when:"2024", title:"FocalPlane Correspondent travel grant", where:"The Company of Biologists"},

  // Fellowships and scholarships
  {group:"fellowship", sort:"2023", when:"2020 – 2023", title:"UGC Senior and Junior Research Fellowships", where:"University Grants Commission, India"},
  {group:"fellowship", sort:"2020", when:"2018 – 2020", title:"Junior Research Fellowships", where:"MHRD (IIT Jodhpur) and DAE (NISER Bhubaneswar)"},
  {group:"fellowship", sort:"2018", when:"2016 – 2018", title:"DBT Merit Scholarship", where:"Department of Biotechnology, India", note:"MSc Biotechnology, Banaras Hindu University."},

  // Community roles
  {group:"role", sort:"2026", when:"2025 – present", title:"eLife Ambassador", where:"eLife"},
  {group:"role", sort:"2026", when:"Current", title:"EACR Ambassador", where:"European Association for Cancer Research"},
  {group:"role", sort:"2026", when:"Current", title:"FocalPlane Correspondent", where:"The Company of Biologists"},
  {group:"role", sort:"2026", when:"Current", title:"Senior Collaborator", where:"Global Burden of Disease (GBD) network, IHME"},
  {group:"role", sort:"2026", when:"Current", title:"Member", where:"The Alan Turing Institute"}
];
