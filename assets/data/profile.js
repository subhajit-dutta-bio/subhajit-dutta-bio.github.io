/* ============================================================
   PROFILE AND SETTINGS — the only file you must edit before launch
   ============================================================ */
window.SITE = window.SITE || {};
window.SITE.profile = {
  name: "Subhajit Dutta",

  // Date of the last content update. Leave empty: the build stamps today's date into every footer.
  updated: "",
  email: "dsubhajit.edu@gmail.com",
  orcid: "0000-0003-2390-7492",

  // Current position. The home-page "Now" strip, profile card and footers update from here.
  // "org" is deliberately empty for now (no institute named on the site); when you are ready to
  // announce the move, set org to e.g. "IFOM, Milan" and city/country to Milan/Italy, then run the build.
  position: {
    role: "Researcher",
    headline: "Researcher in cancer biology and computation",
    org: "",
    orgFull: "",
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
    linkedin: "https://www.linkedin.com/in/subhajit-dutta-bio/",
    x: "https://x.com/SDutta_2904",
    bluesky: "https://bsky.app/profile/sdutta.bsky.social",
    researchgate: "https://www.researchgate.net/profile/Subhajit-Dutta-3"
  },

  // Collaboration form: free access key from https://web3forms.com (emailed to you, no account needed).
  // Messages are delivered to the email you register there (use dsubhajit.edu@gmail.com).
  web3formsKey: "f3f25369-b0d8-497b-a456-4c7816723119",

  // GoatCounter site code (cookie-free analytics). Empty = no analytics. If you ever enable it,
  // also add a "Visitor statistics" paragraph to /legal/ describing it, and allow
  // https://gc.zgo.at and the GoatCounter domain in the Content-Security-Policy meta tag of every page.
  goatcounter: "",

  // Legal page. No postal address is published; it is given on request by email.
  legal: {
    address: "",
    phone: ""   // optional
  }
};
