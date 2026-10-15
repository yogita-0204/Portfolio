export const personalInfo = {
  name: "Yogita Yadav",
  title: "Data Scientist, ML Engineer & UX Product Architect",
  tagline: "Bridging the gap between intelligent algorithms and intuitive human experiences.",
  summary: "Final-year Computer Science Engineering student at Lovely Professional University with a strong foundation in Machine Learning, predictive modeling, big data pipelines, and UI/UX product design. Co-inventor of an IoT patent and creator of end-to-end data systems that translate complex analytics into measurable business impact.",
  email: "yogitayadav422003@gmail.com",
  phone: "+91 7568259835",
  location: "Punjab / Rajasthan, India",
  status: "Available for Full-time Roles & Innovations",
  github: "https://github.com/yogita-0204",
  linkedin: "https://www.linkedin.com/in/yogita-yadav-42geta",
  profileImage: "/assets/yogita-profile.jpg",
  stats: [
    { label: "CLV Value at Risk Unlocked", value: "$7.2M+", icon: "TrendingUp", highlight: "Across 3,522 accounts" },
    { label: "Sales Data Analyzed", value: "$899.9M", icon: "BarChart3", highlight: "9,648 Transactions" },
    { label: "IoT Hardware Patents", value: "1 Granted", icon: "Award", highlight: "Thermal PCM + ESP32" },
    { label: "Model Predictive ROC-AUC", value: "0.92", icon: "Cpu", highlight: "With SHAP Explainability" }
  ]
};

export const skillsData = {
  categories: [
    {
      id: "ml-ai",
      name: "AI & Machine Learning",
      description: "Predictive pipelines, statistical modeling, feature engineering & model explainability.",
      skills: [
        { name: "Scikit-Learn & ML Algorithms", level: 92, tags: ["Random Forest", "Logistic Reg", "XGBoost", "K-Means"] },
        { name: "SHAP Explainability", level: 88, tags: ["Feature Importance", "Beeswarm Plots", "Force Plots"] },
        { name: "LLMs & Vector Embeddings", level: 82, tags: ["RAG Concepts", "Semantic Search", "Prompt Engineering"] },
        { name: "Time Series & Forecasting", level: 85, tags: ["ARIMA", "Trend Analysis", "Seasonality"] },
        { name: "LightGBM & PuLP", level: 80, tags: ["Gradient Boosting", "Linear Programming"] }
      ]
    },
    {
      id: "data-analytics",
      name: "Big Data & Business Intelligence",
      description: "Enterprise data transformation, DAX modeling, drill-down dashboards & SQL pipelines.",
      skills: [
        { name: "Power BI & DAX Modeling", level: 94, tags: ["10+ Measures", "Sync Visuals", "Drill-Downs"] },
        { name: "Power Query & Data Cleansing", level: 90, tags: ["ETL Pipelines", "Feature Extraction"] },
        { name: "PySpark & Databricks", level: 82, tags: ["Distributed Data", "Cluster Analytics"] },
        { name: "SQL & Relational Databases", level: 88, tags: ["MS SQL Server", "MySQL", "Indexing", "Aggregations"] },
        { name: "MLflow & Experimentation", level: 80, tags: ["Model Tracking", "Artifact Logging"] }
      ]
    },
    {
      id: "ui-ux",
      name: "UI/UX & Product Design",
      description: "User research, information architecture, wireframing, design systems & Figma prototyping.",
      skills: [
        { name: "Figma & Design Systems", level: 92, tags: ["Components", "Auto Layout", "Tokens", "Variants"] },
        { name: "Information Architecture (IA)", level: 88, tags: ["User Flows", "Sitemaps", "Card Sorting"] },
        { name: "Wireframing & Prototyping", level: 90, tags: ["Lo-Fi Wireframes", "Hi-Fi Clickable Mockups"] },
        { name: "User Journey Mapping", level: 85, tags: ["Pain Points", "Empathy Maps", "Touchpoints"] },
        { name: "Micro-Interactions & Motion", level: 84, tags: ["Feedback States", "Transitions", "Usability"] }
      ]
    },
    {
      id: "web-backend",
      name: "Backend, APIs & Frontend",
      description: "Scalable REST APIs, transactional database safety, web frameworks & modern frontends.",
      skills: [
        { name: "Python", level: 95, tags: ["NumPy", "Pandas", "Matplotlib", "Seaborn"] },
        { name: "FastAPI & REST APIs", level: 88, tags: ["Pydantic", "Async Endpoints", "Render Deployment"] },
        { name: "Django & Full-Stack Architecture", level: 86, tags: ["Custom Decorators", "ORM Aggregations", "Auth"] },
        { name: "Modern Web (React / JS / CSS)", level: 84, tags: ["Three.js", "GSAP", "Tailwind", "Responsive UI"] },
        { name: "C++ & Core CS Fundamentals", level: 85, tags: ["DSA", "OOP", "DBMS", "Operating Systems"] }
      ]
    }
  ]
};

export const projectsData = [
  {
    id: "telecom-retention",
    title: "Telecom Customer Retention Intelligence System",
    category: "ai-ml",
    categoryLabel: "AI & Machine Learning",
    summary: "End-to-end churn prediction pipeline on 7,043 customer records with SHAP explainability and a 2x2 multi-model decision matrix uncovering $7.2M+ CLV at risk.",
    image: "/assets/telecom-ml.jpg",
    metrics: [
      { label: "ROC-AUC Score", value: "0.92" },
      { label: "Recall Rate", value: "0.86" },
      { label: "CLV Regression R²", value: "0.9976" },
      { label: "Value at Risk", value: "$7.2M+" }
    ],
    techStack: ["Python", "Scikit-Learn", "FastAPI", "Streamlit", "SHAP", "Pandas", "NumPy", "Pytest", "Render"],
    links: {
      github: "https://github.com/yogita-0204",
      live: "#lab",
      demoLabel: "Launch Live Simulator"
    },
    highlights: [
      "Built end-to-end churn prediction pipeline on 7,043 telecom records with automated feature engineering.",
      "Designed a multi-model decision-support system (classification + CLV regression + KMeans clustering k=4) prioritizing 3,522 at-risk churners.",
      "Deployed via FastAPI microservice on Render paired with an interactive Streamlit dashboard.",
      "Engineered 35 pytest validation gates ensuring reproducible seed-42 pipeline integrity."
    ],
    deepDive: {
      problem: "Telecom providers suffer revenue leakage because churn intervention occurs too late and without visibility into customer lifetime value priority.",
      solution: "A dual-stage system that simultaneously estimates probability of churn and quantifies economic impact ($ at risk), surfacing precise intervention targets.",
      architecture: "Raw Data (7,043 records) -> Feature Cleansing -> ML Pipeline (Logistic / Random Forest) -> SHAP Feature Attribution -> 2x2 CLV Priority Matrix -> FastAPI API -> Streamlit Frontend."
    }
  },
  {
    id: "adidas-sales-bi",
    title: "Adidas US Sales Analytics Intelligence",
    category: "analytics",
    categoryLabel: "Data Analytics & Power BI",
    summary: "Executive 3-page interactive Power BI dashboard tracking $899.90M sales and $332.13M profit with 10+ custom DAX measures, synchronized visuals, and multi-dimensional slicers.",
    image: "/assets/adidas-bi.jpg",
    metrics: [
      { label: "Total Sales Tracked", value: "$899.90M" },
      { label: "Operating Profit", value: "$332.13M" },
      { label: "Transactions", value: "9,648" },
      { label: "Top Retailer Share", value: "72%" }
    ],
    techStack: ["Power BI", "DAX", "Power Query", "Microsoft Excel", "Data Modeling"],
    links: {
      github: "https://github.com/yogita-0204",
      demoLabel: "View Case Breakdown"
    },
    highlights: [
      "Engineered automated Power Query ETL pipeline cleaning 9,648 transactions over 2020-2021 sales data.",
      "Authored 10+ robust DAX measures for Total Sales, Operating Profit, YoY Growth, and Retailer Margin contributions.",
      "Designed synchronized bubble, combo, donut and trend charts with 6 interactive slicers for self-service executive drill-down.",
      "Discovered key business insight: top three retailers led by West Gear drove 72% of total sales, with Men's Street Footwear leading product volume."
    ],
    deepDive: {
      problem: "Executive stakeholders struggled to connect broad sales figures with product categories, regional margins, and retail distributor performance.",
      solution: "A unified, dynamic BI cockpit delivering immediate drill-downs from national performance to individual retailer and SKU profitability.",
      architecture: "Multi-table Star Schema -> Cleaned Fact Table (Sales) + Dimension Tables (Retailer, Product, Region, Date) -> Dynamic DAX Measure Engine -> Interactive Visual Layer."
    }
  },
  {
    id: "patent-iot-seat",
    title: "Temperature-Sensitive Smart Car Seat Cover",
    category: "iot-hardware",
    categoryLabel: "IoT Hardware & Patent",
    summary: "Patented IoT-enabled smart car seat cover utilizing Phase Change Material (PCM) thermal buffering combined with active ESP32 automated heating and cooling regulation.",
    image: "/assets/patent-iot.jpg",
    metrics: [
      { label: "Patent Status", value: "Co-Inventor" },
      { label: "Microcontroller", value: "ESP32" },
      { label: "Thermal Buffer", value: "PCM Layer" },
      { label: "Telemetry", value: "Bluetooth / Wi-Fi" }
    ],
    techStack: ["ESP32", "C++ / Embedded", "IoT Sensors", "Phase Change Material", "Mobile App Telemetry"],
    links: {
      demoLabel: "Inspect 3D Schematic"
    },
    highlights: [
      "Co-invented patented hardware device regulating automotive seat temperature automatically.",
      "Combined Phase Change Material (PCM) for passive thermal buffering with active thermoelectric elements.",
      "Integrated analog/digital temperature sensors with ESP32 to monitor seat thermodynamics in real-time.",
      "Enabled wireless telemetry for mobile app monitoring, presets, and customized driver thermal comfort curves."
    ],
    deepDive: {
      problem: "Extreme vehicle cabin temperatures (scorching summer heat or freezing winter seats) cause driver discomfort and delayed thermal stabilization.",
      solution: "A dual-action regulation mechanism: PCM absorbs thermal spikes passively while active heating/cooling tiles kick in automatically based on microcontroller thresholds.",
      architecture: "Perforated Comfort Fabric -> Sensor Matrix -> Thermal Spreading Layer -> PCM Honeycomb Buffer -> Peltier Thermoelectric Modules -> ESP32 Microcontroller -> Smartphone Bluetooth App."
    }
  },
  {
    id: "foodr-crowd-app",
    title: "foodR — Campus Pre-Order & Crowd Management",
    category: "full-stack",
    categoryLabel: "Full-Stack Web App",
    summary: "Full-stack Django application with race-condition-safe atomic order scheduling, role-based shopkeeper analytics, and UPI QR-code payment flow across 5 modular applications.",
    image: "/assets/foodr.jpg",
    metrics: [
      { label: "Modular Apps", value: "5 Services" },
      { label: "Concurrency", value: "Atomic Locks" },
      { label: "Payment", value: "Instant UPI/QR" },
      { label: "Analytics", value: "Django ORM" }
    ],
    techStack: ["Django", "Python", "MySQL", "Tailwind CSS", "HTML5", "JavaScript", "Git"],
    links: {
      github: "https://github.com/yogita-0204",
      demoLabel: "View System Architecture"
    },
    highlights: [
      "Architected foodR with role-based access control (Student/Faculty User vs. Canteen Shop Owner) across 5 modular Django services.",
      "Engineered race-condition-safe scheduling using atomic token allocation and slot validation to prevent duplicate ordering.",
      "Built dynamic canteen analytics dashboard utilizing Django ORM aggregations to surface peak queue hours and bestselling menu items.",
      "Integrated seamless UPI QR code generation and real-time in-app order status notifications."
    ],
    deepDive: {
      problem: "College cafeteria peak-hour congestion resulted in 30+ minute student wait times and inventory bottlenecks for shopkeepers.",
      solution: "A timed pre-order slot system that balances kitchen order queues into discrete preparation windows, eliminating crowding.",
      architecture: "Student Client / Shopkeeper Portal -> Django Modular Backend -> Atomic DB Transactions (MySQL) -> ORM Analytics Engine -> Real-time Notification Dispatch."
    }
  },
  {
    id: "dabbagaram-redesign",
    title: "Dabba Garam — Food Delivery App Redesign",
    category: "ui-ux",
    categoryLabel: "UI/UX & Product Design",
    summary: "Comprehensive mobile app redesign covering user journey mapping, design system creation in Figma, streamlined meal exploration, and scheduled pickup slots.",
    image: "/assets/dabbagaram.jpg",
    metrics: [
      { label: "Design System", value: "Figma Poppins" },
      { label: "Deliverables", value: "End-to-End Flow" },
      { label: "Order Steps", value: "3 Clicks to Pay" },
      { label: "UX Research", value: "Journey Mapping" }
    ],
    techStack: ["Figma", "Design Systems", "User Research", "Wireframing", "Interaction Design", "Prototyping"],
    links: {
      figma: "https://www.figma.com/design/IVT7XLe5dFmxUG9UsXrtzZ/Dabba-midfi?node-id=84-1141",
      demoLabel: "Open Case Study"
    },
    highlights: [
      "Conducted detailed UX journey mapping and heuristic evaluation of legacy food pickup flows.",
      "Designed a modular design system featuring standardized typography (Poppins), fresh amber/green palette, and reusable UI components.",
      "Re-engineered the ordering experience: introduced prominent smart pickup slot scheduling (10m, 20m, 45m).",
      "Redesigned cart breakdown and checkout flow with clear price transparency and instant UPI payment integration."
    ],
    deepDive: {
      problem: "Users experienced decision fatigue from cluttered menu listings and had no clear estimation of when freshly packed meals would be ready for takeaway.",
      solution: "Clean, card-based meal exploration paired with upfront pickup slot reservation and real-time status tracker (Ready for Pickup / Out for Delivery).",
      architecture: "Research & Journey Mapping -> Low-Fi Wireframing -> Design System & Tokens -> High-Fidelity Figma Prototype -> Usability Feedback Iterations."
    }
  },
  {
    id: "kitchenette-app",
    title: "Kitchenette — Smart Dining Zero Waiting",
    category: "ui-ux",
    categoryLabel: "UI/UX & Product Design",
    summary: "Mobile app wireframes and interaction design for campus smart dining featuring live crowd status meters, automated student discounts, and slot-based meal pickup.",
    image: "/assets/kitchenette.jpg",
    metrics: [
      { label: "Crowd Tracking", value: "Live Status" },
      { label: "Pickup Slots", value: "10m to 90m" },
      { label: "Discount Flow", value: "20% Student Offer" },
      { label: "Feedback", value: "Quick Tag System" }
    ],
    techStack: ["Wireframing", "Figma", "Information Architecture", "User Flow Diagrams"],
    links: {
      demoLabel: "Explore Wireframe Flow"
    },
    highlights: [
      "Engineered complete user journey flow: Splash -> Home -> Menu -> Order -> Cart -> Payment -> Pickup -> Feedback.",
      "Created an intuitive 'Live Crowd' indicator (Low / Moderate / Busy) on the home screen to guide ordering times.",
      "Integrated flexible pickup time selector with safety buffer (10-minute hold window for ready food).",
      "Designed post-meal feedback screen with rapid one-tap tags (Tasty, Fast Service, Cold) and serious issue reporting."
    ],
    deepDive: {
      problem: "Busy campus diners lacked visibility into canteen rush hours, causing missed lectures and cold food pickup.",
      solution: "Transparent crowd status combined with slot-scheduled cooking and automated order hold timers.",
      architecture: "Splash & Discovery -> Live Crowd Context -> Menu Customization -> Timed Slot Reservation -> Payment -> Feedback Loop."
    }
  }
];

export const educationData = [
  {
    institution: "Lovely Professional University",
    location: "Phagwara, Punjab",
    degree: "Bachelor of Technology — Computer Science and Engineering",
    period: "Aug 2023 – Present",
    score: "CGPA: 7.63",
    details: "Focusing on Data Science, Machine Learning, Full-Stack Software Engineering, and Human-Computer Interaction (UI/UX)."
  },
  {
    institution: "Children's Academy Convent School",
    location: "Alwar, Rajasthan",
    degree: "Senior Secondary (Intermediate) — Physics, Chemistry, Math",
    period: "Mar 2019 – May 2021",
    score: "Percentage: 81.0%",
    details: "Excellence in analytical mathematics, science coursework, and computer foundations."
  },
  {
    institution: "Step By Step Public School",
    location: "Alwar, Rajasthan",
    degree: "Secondary School (Matriculation)",
    period: "Mar 2018 – May 2019",
    score: "Percentage: 90.2%",
    details: "High academic distinction with top honors in science and mathematics."
  }
];

export const certificationsData = [
  {
    title: "Oracle Certified Foundations Associate",
    issuer: "Oracle",
    date: "May 2026",
    badge: "Cloud & Database Foundations",
    description: "Certified proficiency in database architecture, cloud infrastructure, and enterprise data solutions."
  },
  {
    title: "Privacy and Security in Online Social Media",
    issuer: "NPTEL",
    date: "Oct 2025",
    badge: "Security & Data Ethics",
    description: "In-depth study of data privacy principles, social network graphs, threat modeling, and online information ethics."
  }
];
