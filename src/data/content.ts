/* ===========================================================================
   CONTENT — the single file to edit.
   All text, links and dates on the site live here. Components never hard-code
   copy. Anything still missing from Vikash is `null`: hidden in production
   builds, rendered as a visible TODO chip during `npm run dev`.
   The `openItems` list at the bottom mirrors what still needs to be provided.
   ======================================================================== */

export const site = {
  name: 'Vikash G',
  logo: 'VIKASH.exe',
  role: 'Full Stack Developer',
  email: 'vikashvnb2005@gmail.com',
  github: {
    user: 'vikash1602',
    url: 'https://github.com/vikash1602',
  },
  linkedin: 'https://www.linkedin.com/in/vikash-g-5b83b4273',
  resumePdf: '/G_VIKASH_RESUME.pdf',
  // Replace after the first deploy, or override at build time with SITE_URL.
  siteUrl: 'https://vikash-portfolio.vercel.app',
};

export const nav = [
  { label: '/ABOUT', href: '#about' },
  { label: '/SKILLS', href: '#skills' },
  { label: '/LOGS', href: '#experience' },
  { label: '/WORK', href: '#projects' },
];

export const hero = {
  statusChip: 'SYSTEM STATUS: ONLINE',
  titleLine1: 'FULL STACK',
  titleLine2: 'DEVELOPER',
  tagline: 'I build web apps and ML systems that explain themselves.',
  taglineBold: 'React • Django • Python • AWS',
  ghostWord: 'VIKASH',
  buttons: {
    projects: { label: 'VIEW PROJECTS', href: '#projects' },
    cv: { label: 'DOWNLOAD CV', href: site.resumePdf },
  },
};

export const marquee = [
  'FULL STACK DEVELOPMENT',
  'REACT',
  'DJANGO',
  'MACHINE LEARNING',
  'EXPLAINABLE AI',
  'AWS',
];

export const about = {
  heading: 'WHO AM I?',
  portrait: '/images/portrait.webp',
  portraitTag: 'VIKASH.JPG',
  paragraph:
    'I am Vikash G, a Full Stack Developer and Computer Science Engineering graduate. I build scalable, responsive web applications and bring machine learning into practical projects. I work with React, Django, Python, JavaScript and SQL, and I care about reliable backend systems, explainable models and accessible interfaces.',
  highlightWord: 'explainable',
  pullLines: [
    'Full-stack web apps with React, Django and Python.',
    'QueueWise: real-time appointments and queue management with PostgreSQL and WebSockets.',
    'Machine learning with explainable AI (SHAP).',
    'Published researcher: IRJCS, Vol. 12, Issue 09 (2025).',
    'AWS Academy Graduate, Cloud Architecting (2025).',
  ],
   location: 'Bangalore' as string | null,
   status: 'Available' as string | null,
};

export const skills = {
  headingWhite: 'TECH',
  headingAccent: '_STACK',
  headingAccentColor: 'green',
  systemLabel: '/// SYSTEM_OPTIMIZED',
  tiles: [
    { category: 'LANGUAGE', name: 'Python' },
    { category: 'LANGUAGE', name: 'JavaScript' },
    { category: 'LANGUAGE', name: 'SQL' },
    { category: 'LANGUAGE', name: 'TypeScript' },
    { category: 'CORE', name: 'HTML5' },
    { category: 'STYLING', name: 'CSS3' },
    { category: 'LIBRARY', name: 'React' },
    { category: 'FRAMEWORK', name: 'Django' },
    { category: 'FRAMEWORK', name: 'Django REST Framework' },
    { category: 'FRAMEWORK', name: 'Flask' },
    { category: 'API', name: 'REST APIs' },
    { category: 'REAL-TIME', name: 'WebSockets' },
    { category: 'VISION', name: 'OpenCV' },
    { category: 'ML', name: 'TensorFlow' },
    { category: 'ML', name: 'Scikit-learn' },
    { category: 'XAI', name: 'SHAP' },
    { category: 'TESTING', name: 'Pytest' },
    { category: 'DATABASE', name: 'PostgreSQL' },
    { category: 'DATABASE', name: 'MySQL' },
    { category: 'CLOUD', name: 'AWS' },
    { category: 'OPS', name: 'GitHub' },
    { category: 'ANALYTICS', name: 'Power BI' },
    { category: 'ANALYTICS', name: 'Excel' },
    { category: 'TOOL', name: 'VS Code' },
    { category: 'TOOL', name: 'CLI' },
  ],
};

export const experience = {
  headingWhite: 'CAREER',
  headingAccent: '_JOURNEY',
  education: {
    date: '2022 - JUNE 2026',
    title: 'Bachelor of Engineering (B.E.) in Computer Science Engineering',
    org: 'Er. Perumal Manimekalai College of Engineering',
    cgpa: 'Final CGPA: 8.65 / 10.0',
    coursework:
      'Relevant coursework: Data Structures & Algorithms, Database Management Systems, Web Technologies, Software Engineering, Machine Learning, Computer Networks',
  },
  internship: {
    date: 'JUNE 2025 - AUGUST 2025',
    title: 'Full Stack Development Intern (Summer Internship)',
    org: 'QSpiders, Bengaluru, India',
    bullets: [
      'Engineered a full-stack weather forecasting web application using Python, Flask, HTML, CSS, JavaScript, and integrating OpenWeatherMap API to deliver real-time weather data.',
      'Implemented comprehensive error handling, input validation, reducing runtime errors by 30% improving application stability for end users and reducing API processing time by 18%.',
      'Collaborated with 3 interns using GitHub workflows (feature branching, pull requests, code reviews), resolving 12+ merge conflicts while maintaining zero production bugs.',
      'Delivered 5 technical presentations documenting development progress, API design patterns, and system architecture across project milestones.',
      'Incorporated mentor feedback to refactor 200+ lines of code and enhance design quality, improving code maintainability and overall application reliability.',
    ],
  },
  certifications: {
    date: '2023 - 2025',
    title: 'Certifications & Achievements',
    org: 'Various',
    items: [
      {
        title: 'AWS Academy Graduate - Cloud Architecting (2025)',
        detail:
          'Hands-on training in VPC design, EC2, S3, RDS, Load Balancing, IAM security, CloudWatch monitoring, and scalable cloud architecture implementation.',
        url: null as string | null,
      },
      {
        title: '2nd Prize Winner & Published Paper (2025)',
        detail:
          'Optimized Haar Cascade Algorithm through Parameter Fine-Tuning for Accurate Face Detection. Published in International Research Journal of Computer Science (IRJCS), Vol. 12, Issue 09.',
        url: null as string | null,
      },
      {
        title: "CS50P - Harvard's Introduction to Programming with Python (2024)",
        detail:
          'Python fundamentals, OOP, file I/O and testing through 10 problem sets and a final project.',
        url: null as string | null,
      },
      {
        title: 'Tata Data Visualization Simulation - Forage (2023)',
        detail:
          'Data analytics, dashboard design and executive reporting using Power BI and Excel.',
        url: null as string | null,
      },
    ],
  },
};

export const codingStats = {
  headingWhite: 'CODING',
  headingAccent: '_STATS',
  // Snapshot is generated at build time by scripts/fetch-github.mjs.
  // A LeetCode card is only rendered when a username is provided below.
  leetcodeUser: null as string | null,
};

export const projects = {
  heading: 'SELECTED WORKS',
  viewAll: {
    label: 'VIEW ALL REPOS ON GITHUB',
    href: 'https://github.com/vikash1602?tab=repositories',
  },
  items: [
    {
      id: 'queuewise',
      title: 'QueueWise: Real-Time Queue & Appointment Management Platform',
      tags: ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'WebSockets'],
      description:
        'Designed and developed a full-stack, multi-tenant queue management platform for clinics and service businesses, supporting appointment booking and walk-in queue management with Admin, Staff, and Customer roles. Implemented real-time queue tracking using WebSockets, automated token allocation, and server-side state transitions to ensure accurate queue updates and seamless operations. Ensured data consistency under concurrent requests using PostgreSQL partial unique indexes and row-level locking to prevent double-booking and duplicate token allocation. Developed a dynamic waiting-time estimator using rolling median calculations from completed services, along with database-driven analytics and immutable audit logs. Implemented role-based access control, responsive dashboards, and automated notifications; validated system reliability with 95 automated tests and deployed the application on Render.',
      image: '/images/projects/queuewise.webp',
      imageAlt:
        'QueueWise application landing page: real-time queue and appointment management with customer, staff and admin roles.',
      imagePosition: 'center',
      repo: 'https://github.com/vikash1602/QueueWise',
      demo: 'https://queuewise-mca1.onrender.com/',
    },
    {
      id: 'cardioxai',
      title: 'CardioXAI: Explainable AI for Cardiovascular Disease Prediction',
      tags: ['Python', 'Machine Learning', 'Explainable AI (XAI)', 'SHAP', 'HTML5', 'CSS3', 'JavaScript'],
      description:
        'Web-based cardiovascular disease prediction platform with an interactive interface to assess risk factors and display prediction results. Includes explainable AI visualizations that highlight the key contributing risk factors, and responsive UI components that work across devices.',
      image: '/images/projects/cardioxai.webp',
      imageAlt:
        'CardioXAI dashboard showing risk analytics, patient metrics and SHAP explainability analysis of feature contributions.',
      imagePosition: 'top',
      repo: 'https://github.com/vikash1602/cardioxai',
      demo: 'https://cardioxai-9iq1.onrender.com/',
    },
    {
      id: 'haar-cascades',
      title: 'Enhanced Haar Cascades for Face Detection',
      tags: ['Python', 'OpenCV', 'Computer Vision'],
      description:
        'Optimised OpenCV Haar Cascade parameters (scaleFactor, minNeighbors, minSize) to reduce the false positive rate by 18% against default settings. Tested on 2,000+ images in varied lighting, reaching 90% detection accuracy and 89% precision on the WIDER FACE and FDDB datasets. Linked to the published IRJCS paper.',
      image: '/images/projects/haar-cascades.webp',
      imageAlt:
        'Output of the fine-tuned Haar Cascade detector: people and faces outlined with confidence scores on a street scene.',
      imagePosition: 'center',
      repo: null,
      demo: null,
    },
    {
      id: 'tata-data-viz',
      title: 'Tata Data Visualization Simulation',
      tags: ['Data Analytics', 'Power BI', 'Business Reporting', 'Excel'],
      description:
        'Analysed 50,000+ retail transaction records in Excel to find revenue trends, customer segments and seasonal patterns. Built 3 interactive Power BI dashboards for executives covering revenue growth (YoY), customer retention and regional performance, and formulated 8 data-driven business questions with recommendations.',
      image: '/images/projects/tata-data-viz.webp',
      imageAlt:
        'Stylised cover art for the Tata data visualisation project: three dashboard panels with charts on a black background.',
      imagePosition: 'center',
      repo: null,
      demo: null,
    },
  ],
};

// REPORTS section: renders only when real quotes (with permission) exist.
// With zero quotes the section is not rendered and is absent from navigation.
export const reports = {
  quotes: [] as { quote: string; name: string; org: string; year: string; rating: number | null }[],
};

export const contact = {
  heading: "LET'S BUILD SOMETHING.",
  sticker: 'START A PROJECT',
  availability: null as string | null,
  location: null as string | null,
  endpoint: import.meta.env.VITE_FORM_ENDPOINT as string | null,
  fields: {
    name: { label: 'Your name', placeholder: 'YOUR NAME OR COMPANY' },
    email: { label: 'Your email', placeholder: 'YOU@EXAMPLE.COM' },
    message: { label: 'Your message', placeholder: 'TELL ME ABOUT YOUR PROJECT...', rows: 4 },
  },
  submitLabel: 'TRANSMIT DATA',
};

export const footer = {
  brand: 'VIKASH.',
  tagline: 'Designing the web with raw aesthetics and explainable ideas.',
  ghostWord: 'VIKASH',
  sitemap: [
    { label: 'Home', href: '#top' },
    { label: 'Works', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
};

/* ---------------------------------------------------------------------------
   Remaining optional details. Graduation and CGPA are confirmed and are not
   listed as open items. QueueWise and CardioXAI links are already configured.
--------------------------------------------------------------------------- */
export const openItems = [
  { item: 'Location (city) and availability status', usedIn: 'About badges + Contact', state: '[[PROVIDE]]' },
  { item: 'Approve draft hero tagline / About paragraph / footer tagline', usedIn: 'Hero, About, Footer', state: '[[CONFIRM]] (drafts used)' },
  { item: 'GitHub username confirmation', usedIn: 'Coding stats', state: '[[CONFIRM]] (default: vikash1602 from resume)' },
  { item: 'IRJCS paper URL + certificate URLs (AWS, CS50P, Forage)', usedIn: 'Achievements', state: '[[PROVIDE]] (optional)' },
  { item: 'LeetCode or other coding profile username', usedIn: 'Coding stats', state: '[[PROVIDE]] (optional; omitted)' },
  { item: 'Testimonial quotes with permission (section hidden until then)', usedIn: 'Reports', state: '[[PROVIDE]]' },
  { item: 'Contact form service endpoint (Formspree/Web3Forms endpoint as VITE_FORM_ENDPOINT)', usedIn: 'Contact', state: '[[PROVIDE]]' },
  { item: 'Final deploy URL (canonical/OG/sitemap use the default Vercel subdomain until set)', usedIn: 'SEO', state: '[[CONFIRM]] (set SITE_URL env)' },
];
