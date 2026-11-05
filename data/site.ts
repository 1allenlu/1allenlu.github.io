import {
  BookOpen,
  CandlestickChart,
  Landmark,
  Leaf,
  Plane,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

// All site content lives here. To add a project or role, add one entry.

export const roles = ['Full-Stack Engineer', 'Backend Engineer', 'Machine Learning Engineer'];

export type Education = {
  degree: string;
  school: string;
  date?: string;
  current?: boolean;
  description: string;
};

export const education: Education[] = [
  {
    degree: 'M.Eng. Computer Science',
    school: 'Cornell Tech, Cornell University',
    date: 'Expected May 2027',
    current: true,
    description:
      'Focusing on full-stack development and machine learning. Coursework: Product Studio, Applied Machine Learning, Deep Learning, Optimization for AI, Algorithms and Data Structures for Applications.',
  },
  {
    degree: 'B.S. Mathematics and Computer Science',
    school: 'NYU Tandon School of Engineering',
    description:
      'Double major bridging mathematical theory and applied computer science. Coursework: Artificial Intelligence, Machine Learning, Operating Systems, Algorithms, Databases, Computer Architecture, Data Structures, Applied Statistics, Math Modeling.',
  },
];

export type Experience = {
  title: string;
  org: string;
  date: string;
  description: string;
};

export const experience: Experience[] = [
  {
    title: 'Research Assistant',
    org: 'NYU Computation & Cognition Lab',
    date: 'Oct 2025 – May 2026',
    description:
      'Built a dual LLM-Bayesian learning system that turns natural-language hints into symbolic meaning functions, using PyTorch, Transformers, and in-context learning pipelines to benchmark LLM-generated vs. hand-coded inference.',
  },
  {
    title: 'Student Product Support Analyst',
    org: 'NYU IT',
    date: 'Oct 2024 – May 2026',
    description:
      'Tested and troubleshot NYU Brightspace updates pre-deployment for 80,000+ users, while building training materials and delivering live support sessions.',
  },
  {
    title: 'Software Development Engineer Intern',
    org: 'Athleo.ai',
    date: 'Jun 2024 – Aug 2024',
    description:
      'Engineered a responsive website that attracted 1,500+ daily views, resolved 20+ client-reported issues through QA testing, and produced onboarding videos that reached 30,000+ views.',
  },
  {
    title: 'Private Mathematics Tutor',
    org: 'Freelance',
    date: 'Jul 2022 – May 2026',
    description:
      'Delivered tailored calculus tutoring to 10+ students, helping them pass their introductory calculus courses and exams.',
  },
  {
    title: 'Engineering Intern',
    org: 'Hersheen Enterprise',
    date: 'Jul 2023 – Aug 2023',
    description:
      'Redesigned the company website, increasing daily traffic by 1,000+ visitors, and modeled 3D carpet designs in Catia for manufacturing.',
  },
  {
    title: 'Finance Intern',
    org: 'Hersheen Enterprise',
    date: 'Jul 2022 – Aug 2022',
    description:
      "Managed quotation and purchasing price summaries in Excel and streamlined payroll with wage-conversion tables in the company's ERP system.",
  },
];

export type SkillGroup = {
  name: string;
  span: 2 | 4;
  tagLimit: number;
  tags: string[];
};

export const skills: SkillGroup[] = [
  {
    name: 'Languages',
    span: 2,
    tagLimit: 8,
    tags: ['Python', 'C/C++', 'SQL', 'R', 'JavaScript', 'Swift', 'Java', 'MATLAB'],
  },
  {
    name: 'Frameworks & Libraries',
    span: 4,
    tagLimit: 10,
    tags: [
      'React', 'TypeScript', 'Node.js', 'Express.js', 'FastAPI', 'Flask', 'Tailwind CSS', 'HTML',
      'CSS', 'Vite', 'React Router', 'Mapbox GL', 'Bootstrap', 'Streamlit', 'SwiftUI', 'ActivityKit',
    ],
  },
  {
    name: 'Tools & Databases',
    span: 4,
    tagLimit: 10,
    tags: [
      'Git/GitHub', 'Docker', 'PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'TimescaleDB', 'Redis',
      'SQLAlchemy', 'Mongoose', 'Passport.js', 'OpenAI API', 'Groq API', 'Relational Databases',
      'LaTeX', 'Jest', 'XCTest',
    ],
  },
  {
    name: 'ML & Data Science',
    span: 2,
    tagLimit: 8,
    tags: ['PyTorch', 'Scikit-learn', 'XGBoost', 'NumPy', 'Pandas', 'SHAP', 'Reinforcement Learning', 'Matplotlib'],
  },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  icon: LucideIcon;
  span: 2 | 3 | 4;
  featured?: boolean;
  tagLimit?: number;
  description: string;
  highlights: string[];
  tech: string[];
  url: string;
};

// Grid order matters: each row's spans add up to 6.
export const projects: Project[] = [
  {
    slug: 'policy-pilot',
    title: 'PolicyPilot',
    category: 'AI / Full-Stack',
    icon: ShieldCheck,
    span: 4,
    featured: true,
    tagLimit: 6,
    description:
      'An adaptive training coach for junior health-insurance reviewers that learns from their mistakes and evolves its own coaching harness (Socratic prompts, document checks, and escalation guardrails), with every change validated and versioned in MongoDB Atlas.',
    highlights: [
      'Repeated clarification mistakes turn on Socratic coaching, prior-failure memory, and a documentation checker.',
      'Repeated escalation mistakes add a guardrail that checks escalation criteria first.',
      'A harness change is only accepted if action correctness improves and no previously correct probe regresses.',
      'Every change is stored in MongoDB Atlas with its before and after state, reason, and version.',
    ],
    tech: ['TypeScript', 'Next.js', 'React 19', 'Tailwind CSS', 'Node.js', 'MongoDB Atlas'],
    url: 'https://github.com/1allenlu/policy-pilot',
  },
  {
    slug: 'red-bus-tracker',
    title: 'RedBusTracker',
    category: 'iOS App',
    icon: Smartphone,
    span: 2,
    description:
      'A SwiftUI iOS app that tracks the Roosevelt Island Red Bus shuttle in real time, plus the Tramway schedule, with a Dynamic Island / Lock Screen Live Activity.',
    highlights: [
      'Real-time Red Bus tracking alongside the Tramway schedule.',
      'Dynamic Island and Lock Screen Live Activity built with ActivityKit.',
      'Networking with URLSession, tested with XCTest.',
    ],
    tech: ['Swift', 'SwiftUI', 'ActivityKit', 'URLSession', 'XCTest'],
    url: 'https://github.com/1allenlu/red-bus-tracker',
  },
  {
    slug: 'dbook',
    title: 'DBook',
    category: 'Full-Stack',
    icon: BookOpen,
    span: 2,
    description:
      'A full-stack digital bookshelf with AI-powered recommendations, book search, and a full social/community system.',
    highlights: [
      'Book search by title, author, or ISBN through the Google Books API.',
      'Shelves with reading progress that moves a book to Completed at 100%.',
      'Groq-powered recommendations based on your bookshelf.',
      'Friend requests, user search, profiles, and an admin panel.',
    ],
    tech: [
      'React 18', 'Vite', 'React Router', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB',
      'Mongoose', 'Passport.js', 'Groq API', 'Google Books API',
    ],
    url: 'https://github.com/1allenlu/dbook-digital-bookshelf-review-platform',
  },
  {
    slug: 'ecobite',
    title: 'EcoBite',
    category: 'Full-Stack',
    icon: Leaf,
    span: 2,
    description:
      'Ranks NYC neighborhoods by sustainability using NYC Open Data, with an AI menu scanner that carbon-scores dishes from a photo.',
    highlights: [
      'Mapbox map of 10 clickable NYC neighborhoods with their greenest restaurants.',
      'Green Score built from NYC building energy, water use, and health inspection data.',
      'Upload a menu photo and OpenAI Vision extracts and carbon-scores each dish.',
      'Log orders and track CO₂ saved with a plant avatar that grows through 5 stages.',
    ],
    tech: ['React', 'Tailwind CSS', 'Mapbox GL', 'Vite', 'FastAPI', 'Python', 'SQLite', 'SQLAlchemy', 'OpenAI API'],
    url: 'https://github.com/1allenlu/EcoBite',
  },
  {
    slug: 'ial-trading',
    title: 'IAL Trading Platform',
    category: 'Full-Stack',
    icon: CandlestickChart,
    span: 2,
    tagLimit: 6,
    description:
      'A full-stack stock trading platform with real-time pricing and 100% test coverage across 33+ Jest tests.',
    highlights: [
      'Buy and sell orders with fractional shares and a sufficient-funds check.',
      'Portfolio view of current holdings and their values.',
      'Transaction history showing P&L for each trade.',
    ],
    tech: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'Jest'],
    url: 'https://github.com/1allenlu/IAL-Trading-App',
  },
  {
    slug: 'quantstream',
    title: 'QuantStream',
    category: 'Fintech / ML',
    icon: TrendingUp,
    span: 4,
    tagLimit: 9,
    description:
      'A quant trading framework pairing real-time ML signal generation with a walk-forward backtesting engine.',
    highlights: [
      'Composite BUY/HOLD/SELL signals from ML, RSI, and news sentiment.',
      'XGBoost and PyTorch LSTM models with SHAP explainability.',
      'Pairs, momentum, and mean reversion backtests with walk-forward validation.',
      'VaR/CVaR, Monte Carlo simulation, and efficient frontier risk tools.',
      'Paper trading through Alpaca, plus a background signal-to-order pipeline.',
    ],
    tech: [
      'React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'PostgreSQL', 'TimescaleDB', 'Redis',
      'PyTorch', 'XGBoost', 'SHAP', 'Reinforcement Learning', 'vectorbt', 'Docker',
    ],
    url: 'https://github.com/1allenlu/algo-trading-platform',
  },
  {
    slug: 'nba-predictor',
    title: 'NBA Championship Prediction System',
    category: 'Machine Learning',
    icon: Trophy,
    span: 2,
    tagLimit: 6,
    description: 'An ensemble ML pipeline (91% accuracy) predicting NBA champions, deployed as a live Streamlit app.',
    highlights: [
      'Build a roster under a salary cap and get its championship probability.',
      'Compares Logistic Regression, Random Forest, XGBoost, and a PyTorch neural network.',
      'Calibrated probabilities combined through a soft-vote ensemble.',
      'Trained models load locally or from AWS S3.',
    ],
    tech: ['Python', 'PyTorch', 'NumPy', 'Pandas', 'Scikit-learn', 'Streamlit'],
    url: 'https://github.com/1allenlu/NBA-Championship-Predictor',
  },
  {
    slug: 'loan-default',
    title: 'Loan Default Predictor',
    category: 'Machine Learning',
    icon: Landmark,
    span: 3,
    description: 'Predicts loan defaults with 92.1% accuracy on 32K+ records using PCA and tuned neural networks.',
    highlights: [
      'Compares Logistic Regression, SVM, and neural networks on the Credit Risk Dataset.',
      'Best model: a neural network with a logistic activation, at 79.54% F1.',
      'Built for CS-UY 4563.',
    ],
    tech: ['Python', 'Sklearn', 'NumPy', 'Matplotlib'],
    url: 'https://github.com/1allenlu/Loan-Default-Prediction',
  },
  {
    slug: 'airline-reservation',
    title: 'Airline Ticket Reservation System',
    category: 'Full-Stack',
    icon: Plane,
    span: 3,
    description: 'A full-stack flight booking platform with secure auth and dedicated customer/staff interfaces.',
    highlights: ['Class project for CS-UY 3083, built with Aiden Lee.'],
    tech: ['Python', 'Flask', 'MySQL', 'Relational Databases', 'HTML/CSS'],
    url: 'https://github.com/1allenlu/Online-Airline-Ticket-Reservation-System',
  },
];
