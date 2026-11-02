/* ===========================================================================
   FOLIO — portfolio knowledge base.
   Single source of truth for the chatbot's answers. Keep this file aligned
   with src/data/content.ts. Facts below come from the supplied portfolio
   content and verified project details. Unknown personal facts must remain
   unknown; the assistant must never invent them.
   ======================================================================== */

export interface KnowledgeCategory {
  id: string;
  /** Compact context block handed to the LLM when this category is retrieved. */
  context: string;
  /** Lowercased retrieval keywords (scored, not shown to visitors). */
  keywords: string[];
}

export const PROFILE = {
  name: 'Vikash G',
  assistantName: 'Folio',
  role: 'Full Stack Developer',
  email: 'vikashvnb2005@gmail.com',
  github: 'https://github.com/vikash1602',
  linkedin: 'https://www.linkedin.com/in/vikash-g-5b83b4273',
  resume: '/G_VIKASH_RESUME.pdf',
};

export const SUGGESTED_QUESTIONS = [
  'Who is Vikash?',
  'Explain QueueWise.',
  'Explain CardioXAI.',
  'What technologies does he use?',
  'What was his internship experience?',
  'When did he graduate?',
  'Tell me about his achievements.',
];

export const WELCOME_MESSAGE =
  "Hey! I'm **Folio**, Vikash's portfolio assistant. 🤖\n\nAsk me about his skills, projects, internship or achievements — or try one of the suggestions below.";

export const KNOWLEDGE: KnowledgeCategory[] = [
  {
    id: 'profile',
    context: [
      'PROFILE:',
      `- Name: ${PROFILE.name}.`,
      `- Professional role: ${PROFILE.role}.`,
      '- Graduated with a B.E. in Computer Science Engineering in June 2026.',
      '- Builds full-stack web applications and has project experience integrating machine learning and explainable AI.',
      '- Works with Python, JavaScript, React, Django, Flask, SQL and AWS-related cloud concepts.',
      '- Values reliable backend behaviour, data consistency, explainable ML and accessible interfaces.',
    ].join('\n'),
    keywords: [
      'who', 'vikash', 'about', 'yourself', 'himself', 'introduce', 'background', 'bio',
      'developer', 'role', 'career', 'interest', 'summary', 'profile', 'objective',
      'professional', 'graduated', 'graduate',
    ],
  },
  {
    id: 'education',
    context: [
      'EDUCATION:',
      '- Degree: Bachelor of Engineering (B.E.) in Computer Science Engineering.',
      '- Institution: Er. Perumal Manimekalai College of Engineering.',
      '- Study period: 2022 - June 2026.',
      '- Graduation date: June 2026.',
      '- Final CGPA: 8.65 / 10.0.',
      '- Relevant coursework: Data Structures & Algorithms, Database Management Systems, Web Technologies, Software Engineering, Machine Learning and Computer Networks.',
    ].join('\n'),
    keywords: [
      'education', 'college', 'university', 'degree', 'b.e', 'be ', 'cse', 'computer science',
      'cgpa', 'gpa', 'study', 'studies', 'student', 'coursework', 'academic', 'manimekalai',
      'engineer', 'graduation', 'graduate', 'graduated', 'graduation date', 'graduation year',
      'when did he graduate', 'when did vikash graduate', 'degree completion', 'completed',
      'completion', 'finished', 'passed out', 'pass out', 'final year', 'final cgpa',
    ],
  },
  {
    id: 'skills',
    context: [
      'SKILLS (as listed in the portfolio and demonstrated in projects):',
      '- Languages: Python, JavaScript, SQL.',
      '- Web: HTML5, CSS3, React, Django, Flask and REST APIs.',
      '- Databases: PostgreSQL and MySQL. QueueWise specifically uses PostgreSQL.',
      '- ML / computer vision / explainability: OpenCV, TensorFlow, Scikit-learn and SHAP.',
      '- Analytics: Power BI and Excel.',
      '- Cloud & tools: AWS, GitHub, VS Code and CLI. Testing: Pytest.',
      '- Domains: Full Stack Development, Data Science, Machine Learning and Computer Vision.',
    ].join('\n'),
    keywords: [
      'skill', 'tech', 'technology', 'technologies', 'stack', 'language', 'python', 'javascript',
      'react', 'django', 'flask', 'sql', 'mysql', 'postgres', 'postgresql', 'database', 'aws',
      'cloud', 'opencv', 'tensorflow', 'scikit', 'shap', 'pytest', 'power bi', 'excel',
      'html', 'css', 'rest', 'api', 'know', 'frontend', 'front end', 'backend', 'back end',
      'machine learning', 'ml', 'tools', 'framework', 'library', 'websocket', 'websockets',
      'typescript',
    ],
  },
  {
    id: 'experience',
    context: [
      'EXPERIENCE:',
      '- Role: Full Stack Development Intern (Summer Internship).',
      '- Organisation: QSpiders, Bengaluru, India.',
      '- Dates: June 2025 to August 2025.',
      '- Built a full-stack weather forecasting web application with Python, Flask, HTML, CSS and JavaScript, integrating the OpenWeatherMap API for real-time weather data.',
      '- Implemented error handling and input validation; the resume reports a 30% reduction in runtime errors and an 18% reduction in API processing time.',
      '- Collaborated with 3 interns using GitHub workflows including feature branches, pull requests and code reviews; resolved 12+ merge conflicts with zero production bugs reported.',
      '- Delivered 5 technical presentations on development progress, API design patterns and system architecture.',
      '- Refactored 200+ lines of code following mentor feedback to improve maintainability.',
    ].join('\n'),
    keywords: [
      'experience', 'internship', 'intern', 'qspiders', 'work', 'job', 'worked', 'employment',
      'weather', 'bengaluru', 'bangalore', 'professional', 'team', 'presentation',
      'openweathermap', 'summer internship', 'internship project',
    ],
  },
  {
    id: 'projects',
    context: [
      'PROJECT PORTFOLIO OVERVIEW:',
      '- QueueWise: Real-Time Queue & Appointment Management Platform — a full-stack multi-tenant queue and appointment system for clinics and service businesses. Stack: React, TypeScript, Django REST Framework, PostgreSQL and WebSockets. Detailed technical facts are in the dedicated QueueWise context.',
      '- CardioXAI: Explainable AI for Cardiovascular Disease Prediction — a web platform for assessing cardiovascular risk factors and presenting prediction results with SHAP-based explanations. Stack: Python, machine learning, SHAP, HTML5, CSS3 and JavaScript.',
      '- Enhanced Haar Cascades for Face Detection — OpenCV computer-vision work involving Haar Cascade parameter tuning, evaluated on WIDER FACE and FDDB; linked to an IRJCS publication.',
      '- Tata Data Visualization Simulation — analysed 50,000+ retail transaction records and built 3 Power BI dashboards covering revenue growth, customer retention and regional performance.',
    ].join('\n'),
    keywords: [
      'project', 'projects', 'work sample', 'portfolio', 'built', 'developed', 'application',
      'queuewise', 'queue wise', 'cardioxai', 'cardio xai', 'cardio', 'haar', 'cascade',
      'face detection', 'tata', 'visualization', 'visualisation', 'dashboard', 'power bi',
      'weather', 'demo', 'github', 'xai', 'shap', 'prediction', 'appointment', 'queue',
    ],
  },
  {
    id: 'queuewise',
    context: [
      'PROJECT: QUEUEWISE — REAL-TIME QUEUE & APPOINTMENT MANAGEMENT PLATFORM.',
      '- Purpose: A full-stack, multi-tenant SaaS platform that digitises appointment booking and walk-in queue management for clinics and service businesses.',
      '- User roles: Admin, Staff and Customer, with role-based access control and role-specific experiences.',
      '- Technology stack: React, TypeScript, Django REST Framework, PostgreSQL and WebSockets.',
      '- Real-time behaviour: WebSockets provide live queue tracking and updates. The backend handles automated token allocation and server-side state transitions.',
      '- Concurrency and data integrity: PostgreSQL partial unique indexes and row-level locking are used to prevent double-booking and duplicate token allocation under concurrent requests.',
      '- Waiting-time estimation: A dynamic estimator uses rolling median calculations from completed services.',
      '- Operational features: Database-driven analytics, immutable audit logs, responsive dashboards and automated notifications.',
      '- Reliability: The project was validated with 95 automated tests.',
      '- Deployment: Deployed on Render.',
      '- Live demo: https://queuewise-mca1.onrender.com/',
      '- Source code: https://github.com/vikash1602/QueueWise',
      '- Explanation guidance: Describe it as a real-time queue and appointment platform. Do not claim it is a hospital EHR, payment platform or production system for named customers; those facts are not in the supplied portfolio data.',
    ].join('\n'),
    keywords: [
      'queuewise', 'queue wise', 'queue-management', 'queue management', 'queue system',
      'appointment', 'appointments', 'appointment booking', 'booking', 'walk-in', 'walk in',
      'clinic', 'clinics', 'service business', 'customer', 'staff', 'admin', 'multi tenant',
      'multi-tenant', 'saas', 'real time', 'realtime', 'websocket', 'websockets', 'socket',
      'live queue', 'queue tracking', 'token', 'tokens', 'token allocation', 'duplicate token',
      'double booking', 'double-booking', 'concurrency', 'concurrent', 'row level locking',
      'row-level locking', 'partial unique index', 'partial unique indexes', 'postgres',
      'postgresql', 'waiting time', 'wait time', 'rolling median', 'audit log', 'audit logs',
      'role based access', 'rbac', '95 tests', 'automated tests', 'render', 'queuewise demo',
      'queuewise github', 'how does queuewise work', 'explain queuewise',
    ],
  },
  {
    id: 'cardioxai',
    context: [
      'PROJECT: CARDIOXAI — EXPLAINABLE AI FOR CARDIOVASCULAR DISEASE PREDICTION.',
      '- Purpose: A web-based platform that assesses cardiovascular risk factors and displays prediction results.',
      '- Explainability: SHAP visualisations highlight the key contributing risk factors behind a prediction.',
      '- Technology stated in the portfolio: Python, Machine Learning, SHAP, HTML5, CSS3 and JavaScript.',
      '- Source code: https://github.com/vikash1602/cardioxai',
      '- Live demo: https://cardioxai-9iq1.onrender.com/',
      '- Do not invent a specific model architecture, dataset, accuracy score or clinical validation result; those details are not specified in this portfolio knowledge base.',
    ].join('\n'),
    keywords: [
      'cardioxai', 'cardio xai', 'cardio', 'cardiovascular', 'heart disease', 'heart risk',
      'risk prediction', 'prediction', 'explainable ai', 'xai', 'shap', 'feature importance',
      'risk factors', 'medical ai', 'machine learning project', 'cardioxai demo',
      'cardioxai github', 'explain cardioxai',
    ],
  },
  {
    id: 'haar-cascades',
    context: [
      'PROJECT: ENHANCED HAAR CASCADES FOR FACE DETECTION.',
      '- Used OpenCV Haar Cascade face detection and optimised scaleFactor, minNeighbors and minSize parameters.',
      '- The portfolio reports an 18% reduction in false-positive rate compared with default settings.',
      '- Tested on 2,000+ images in varied lighting conditions using WIDER FACE and FDDB datasets.',
      '- Reported results: 90% detection accuracy and 89% precision.',
      '- Research paper: “Optimized Haar Cascade Algorithm through Parameter Fine-Tuning for Accurate Face Detection”, published in International Research Journal of Computer Science (IRJCS), Vol. 12, Issue 09 (2025).',
      '- The portfolio lists a 2nd prize for this work. No paper URL or source-code repository URL is currently supplied.',
    ].join('\n'),
    keywords: [
      'haar', 'haar cascade', 'haar cascades', 'face detection', 'opencv', 'computer vision',
      'scale factor', 'scalefactor', 'min neighbors', 'minneighbors', 'min size', 'minsize',
      'false positive', 'precision', 'accuracy', 'wider face', 'fddb', 'irjcs', 'research paper',
      'published paper', 'face detector',
    ],
  },
  {
    id: 'tata-data-viz',
    context: [
      'PROJECT: TATA DATA VISUALIZATION SIMULATION.',
      '- Analysed 50,000+ retail transaction records in Excel to identify revenue trends, customer segments and seasonal patterns.',
      '- Built 3 interactive Power BI dashboards for executives covering year-over-year revenue growth, customer retention and regional performance.',
      '- Formulated 8 data-driven business questions and recommendations.',
      '- Completed as a Tata Data Visualization Simulation through Forage.',
    ].join('\n'),
    keywords: [
      'tata', 'data visualization', 'data visualisation', 'forage', 'power bi', 'excel',
      'retail', 'transaction records', '50,000', 'revenue growth', 'customer retention',
      'regional performance', 'business dashboard', 'analytics simulation',
    ],
  },
  {
    id: 'achievements',
    context: [
      'ACHIEVEMENTS & CERTIFICATIONS:',
      '- AWS Academy Graduate - Cloud Architecting (2025): training in VPC design, EC2, S3, RDS, Load Balancing, IAM, CloudWatch and scalable cloud architecture.',
      '- 2nd Prize Winner & Published Paper (2025): “Optimized Haar Cascade Algorithm through Parameter Fine-Tuning for Accurate Face Detection”, published in International Research Journal of Computer Science (IRJCS), Vol. 12, Issue 09.',
      "- CS50P - Harvard's Introduction to Programming with Python (2024): Python fundamentals, OOP, file I/O and testing.",
      '- Tata Data Visualization Simulation - Forage (2023): data analytics, dashboard design and executive reporting with Power BI and Excel.',
    ].join('\n'),
    keywords: [
      'achievement', 'achievements', 'certification', 'certifications', 'certificate', 'award',
      'prize', 'paper', 'research', 'irjcs', 'publication', 'published', 'aws academy',
      'cs50', 'harvard', 'forage', 'winner', 'recognition', '2nd prize', 'second prize',
    ],
  },
  {
    id: 'contact',
    context: [
      'CONTACT & LINKS:',
      `- Email: ${PROFILE.email}`,
      `- GitHub: ${PROFILE.github}`,
      `- LinkedIn: ${PROFILE.linkedin}`,
      `- Resume (PDF): available for download from the site (${PROFILE.resume}).`,
      '- QueueWise live demo: https://queuewise-mca1.onrender.com/',
      '- QueueWise source code: https://github.com/vikash1602/QueueWise',
      '- CardioXAI live demo: https://cardioxai-9iq1.onrender.com/',
      '- CardioXAI source code: https://github.com/vikash1602/cardioxai',
    ].join('\n'),
    keywords: [
      'contact', 'email', 'mail', 'reach', 'hire', 'linkedin', 'github', 'resume', 'cv',
      'connect', 'touch', 'availability', 'download', 'link', 'links', 'social',
      'queuewise link', 'queuewise demo', 'queuewise repository', 'queuewise repo',
    ],
  },
  {
    id: 'tech-concepts',
    context: [
      'TECH CONCEPT GUIDANCE:',
      'For general technical questions (for example, “What is React?”), answer briefly and accurately, then connect the concept to Vikash’s experience only where the connection is supported by the portfolio.',
      'Relevant connections: React, Django and Flask for web applications; PostgreSQL for QueueWise data integrity and concurrent booking/token allocation; WebSockets for real-time queue updates in QueueWise; OpenCV for face-detection research; SHAP with machine learning for CardioXAI; AWS for cloud architecting certification; Power BI and Excel for the Tata simulation; Pytest for testing.',
      'For QueueWise technical explanations: PostgreSQL row-level locking coordinates concurrent operations, while partial unique indexes enforce uniqueness constraints for applicable records. WebSockets enable server-pushed real-time queue updates. The waiting-time estimator uses rolling median calculations from completed services.',
    ].join('\n'),
    keywords: [
      'what is', 'explain', 'how does', 'difference between', 'why', 'definition', 'meaning of',
      'react', 'django', 'python', 'api', 'machine learning', 'shap', 'aws', 'database', 'rest',
      'concept', 'hook', 'orm', 'mvt', 'mvc', 'postgresql', 'postgres', 'websocket',
      'row level locking', 'partial unique index', 'rolling median', 'concurrency',
    ],
  },
];

/** Always-included micro profile so the model never answers blind. */
export const CORE_CONTEXT = [
  `${PROFILE.name} is a ${PROFILE.role}.`,
  'He graduated with a B.E. in Computer Science Engineering in June 2026 with a final CGPA of 8.65 / 10.0.',
  'His featured full-stack project is QueueWise, built with React, TypeScript, Django REST Framework, PostgreSQL and WebSockets.',
];
