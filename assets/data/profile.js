/* ============================================================
   PROFILE AND SETTINGS — the only file you must edit before launch
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.profile = {
  name: "Subhajit Dutta",

  // Date of the last content update (YYYY-MM-DD), shown in every footer. Change it whenever you edit the site.
  updated: "2026-10-17",
  email: "dsubhajit.edu@gmail.com",
  orcid: "0000-0003-2390-7492",

  // Current position. When you change job, edit these lines: the home-page "Now" strip,
  // profile card, footers, Collaborate and Legal pages update from here. Also update the
  // "affiliation" block near the top of index.html and "home" in assets/data/network.js.
  position: {
    role: "Researcher",
    org: "Institute of Biochemistry and Molecular Cell Biology, UKE Hamburg",
    orgFull: "Institute of Biochemistry and Molecular Cell Biology (IBMZ), Center for Experimental Medicine, UKE, Hamburg",
    city: "Hamburg",
    country: "Germany"
  },

  // Your site address once deployed, with trailing slash. Used for canonical links and sharing.
  siteUrl: "https://duttasubhajit.com/",

  // Headshot. Put the file in assets/img/ and set the path, e.g. "/assets/img/portrait.jpg".
  // Leave empty and a monogram is shown instead.
  photo: "/assets/img/portrait.webp",

  // Image shown when the site is shared on LinkedIn, X, WhatsApp. 1200×630 px recommended.
  ogImage: "/assets/img/og.jpg",

  // Your CV as PDF, e.g. "/assets/pdf/CV_Subhajit_Dutta.pdf". Leave empty to hide the button.
  cvPdf: "",

  // Profile links. Empty entries are hidden.
  links: {
    scholar: "https://scholar.google.com/citations?user=DbkLvm4AAAAJ&hl=en",
    github: "https://github.com/subhajit-dutta-bio",    // https://github.com/...
    linkedin: "https://www.linkedin.com/in/subhajit-dutta-6a4b96134/",
    x: "https://x.com/SDutta_2904",
    bluesky: "",
    researchgate: ""
  },

  // Collaboration form: free access key from https://web3forms.com (emailed to you, no account needed).
  // Messages are delivered to the email you register there (use dsubhajit.edu@gmail.com).
  web3formsKey: "REPLACE-WITH-YOUR-WEB3FORMS-ACCESS-KEY",

  // GoatCounter site code (cookie-free analytics). Empty = no analytics. If you ever enable it,
  // also add a "Visitor statistics" paragraph to /legal/ describing it.
  goatcounter: "",

  // Legal page. No postal address is published; it is given on request by email.
  legal: {
    address: "",
    phone: ""   // optional
  }
};
