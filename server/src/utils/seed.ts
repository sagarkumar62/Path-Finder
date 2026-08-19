import { connectDB } from '../config/db';
import { Career } from '../models/Career';
import { Skill } from '../models/Skill';
import { LearningResource } from '../models/LearningResource';
import { logger } from './logger';

export const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Seeding database with career, skill, and resource data...');

    // Clear existing collection items
    await Career.deleteMany({});
    await Skill.deleteMany({});
    await LearningResource.deleteMany({});

    // 1. Seed Skills
    const skillsData = [
      { name: 'JavaScript', category: 'Programming', description: 'Core web scripting language' },
      { name: 'TypeScript', category: 'Programming', description: 'Typed JavaScript superset' },
      { name: 'Python', category: 'Programming', description: 'Data science and backend scripting language' },
      { name: 'React', category: 'Frontend', description: 'Frontend UI library' },
      { name: 'Next.js', category: 'Frontend', description: 'React framework for production' },
      { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime environment' },
      { name: 'Express.js', category: 'Backend', description: 'Node.js web application framework' },
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database' },
      { name: 'SQL / PostgreSQL', category: 'Database', description: 'Relational database management' },
      { name: 'Machine Learning', category: 'AI/ML', description: 'Predictive modeling and algorithms' },
      { name: 'Deep Learning', category: 'AI/ML', description: 'Neural networks and deep learning architectures' },
      { name: 'PyTorch', category: 'AI/ML', description: 'Open-source machine learning framework' },
      { name: 'Statistics & Math', category: 'Data Science', description: 'Probability, linear algebra, hypothesis testing' },
      { name: 'Data Visualization', category: 'Data Science', description: 'Matplotlib, Seaborn, Tableau' },
      { name: 'Docker', category: 'DevOps', description: 'Containerization platform' },
      { name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration' },
      { name: 'AWS / Cloud', category: 'Cloud Infrastructure', description: 'Amazon Web Services cloud architecture' },
      { name: 'Cybersecurity & Security', category: 'Security', description: 'Network security, cryptography, penetration testing' },
      { name: 'Figma & UI/UX Design', category: 'Design', description: 'Interface design, wireframing, and user experience research' },
      { name: 'Git & GitHub', category: 'Tools', description: 'Version control and source code management' },
      { name: 'REST & GraphQL APIs', category: 'Backend', description: 'API architecture and protocol design' },
    ];

    await Skill.insertMany(skillsData);
    logger.info(`Inserted ${skillsData.length} skills.`);

    // 2. Seed Careers
    const careersData = [
      {
        title: 'AI Engineer',
        description: 'Builds, fine-tunes, and deploys artificial intelligence systems and LLM powered applications.',
        category: 'Artificial Intelligence',
        estimatedMonths: 8,
        averageSalary: '$120,000 - $180,000',
        demandLevel: 'Very High',
        requiredSkills: [
          { skill: 'Python', importance: 0.95 },
          { skill: 'Machine Learning', importance: 0.9 },
          { skill: 'PyTorch', importance: 0.85 },
          { skill: 'Deep Learning', importance: 0.85 },
          { skill: 'REST & GraphQL APIs', importance: 0.8 },
          { skill: 'SQL / PostgreSQL', importance: 0.75 },
          { skill: 'Git & GitHub', importance: 0.7 },
        ],
        recommendedSkills: [
          { skill: 'Docker', importance: 0.65 },
          { skill: 'TypeScript', importance: 0.6 },
          { skill: 'AWS / Cloud', importance: 0.6 },
        ],
        learningResources: [
          { title: 'Python for Data Science & AI', type: 'Course', url: 'https://coursera.org/learn/python-for-applied-data-science-ai', isFree: true },
          { title: 'Deep Learning Specialization by Andrew Ng', type: 'Course', url: 'https://coursera.org/specializations/deep-learning', isFree: false },
          { title: 'PyTorch Official Fundamentals Tutorials', type: 'Interactive', url: 'https://pytorch.org/tutorials/', isFree: true },
        ],
        projects: [
          { title: 'RAG-Based Knowledge Assistant', description: 'Build an AI chatbot querying PDF documents using vector embeddings.', difficulty: 'Intermediate' },
          { title: 'Fine-Tuned LLM Model Classifier', description: 'Fine-tune an open-source Llama model for specific sentiment classification.', difficulty: 'Advanced' },
        ],
      },
      {
        title: 'Full Stack Developer',
        description: 'Engineers both web client interfaces and server-side backend logic, databases, and microservices.',
        category: 'Web Development',
        estimatedMonths: 6,
        averageSalary: '$95,000 - $150,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'JavaScript', importance: 0.95 },
          { skill: 'TypeScript', importance: 0.9 },
          { skill: 'React', importance: 0.88 },
          { skill: 'Node.js', importance: 0.88 },
          { skill: 'Express.js', importance: 0.85 },
          { skill: 'MongoDB', importance: 0.8 },
          { skill: 'REST & GraphQL APIs', importance: 0.85 },
          { skill: 'Git & GitHub', importance: 0.8 },
        ],
        recommendedSkills: [
          { skill: 'Docker', importance: 0.7 },
          { skill: 'Next.js', importance: 0.75 },
          { skill: 'AWS / Cloud', importance: 0.65 },
        ],
        learningResources: [
          { title: 'Full Stack Open', type: 'Course', url: 'https://fullstackopen.com/', isFree: true },
          { title: 'Node.js & React Developer Bootcamp', type: 'Course', url: 'https://udemy.com', isFree: false },
        ],
        projects: [
          { title: 'SaaS E-Commerce Platform', description: 'Build a multi-tenant web application with authentication, cart, and payment flow.', difficulty: 'Intermediate' },
        ],
      },
      {
        title: 'Frontend Developer',
        description: 'Crafts responsive, performant, and beautiful visual interfaces and interactive client apps.',
        category: 'Web Development',
        estimatedMonths: 5,
        averageSalary: '$85,000 - $135,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'JavaScript', importance: 0.95 },
          { skill: 'TypeScript', importance: 0.9 },
          { skill: 'React', importance: 0.92 },
          { skill: 'Next.js', importance: 0.85 },
          { skill: 'Figma & UI/UX Design', importance: 0.7 },
          { skill: 'Git & GitHub', importance: 0.8 },
        ],
        recommendedSkills: [
          { skill: 'REST & GraphQL APIs', importance: 0.75 },
          { skill: 'Node.js', importance: 0.5 },
        ],
        learningResources: [
          { title: 'React Documentation & Interactive Guide', type: 'Article', url: 'https://react.dev', isFree: true },
        ],
        projects: [
          { title: 'Interactive Analytics Dashboard', description: 'Design a real-time responsive analytics panel with dark mode and charting.', difficulty: 'Intermediate' },
        ],
      },
      {
        title: 'Backend Developer',
        description: 'Designs scalable server APIs, microservice architectures, databases, and background tasks.',
        category: 'Web Development',
        estimatedMonths: 6,
        averageSalary: '$95,000 - $145,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'Node.js', importance: 0.9 },
          { skill: 'Express.js', importance: 0.88 },
          { skill: 'TypeScript', importance: 0.85 },
          { skill: 'SQL / PostgreSQL', importance: 0.85 },
          { skill: 'MongoDB', importance: 0.8 },
          { skill: 'REST & GraphQL APIs', importance: 0.9 },
          { skill: 'Docker', importance: 0.75 },
          { skill: 'Git & GitHub', importance: 0.8 },
        ],
        recommendedSkills: [
          { skill: 'Python', importance: 0.6 },
          { skill: 'AWS / Cloud', importance: 0.7 },
        ],
        learningResources: [
          { title: 'Backend Engineering Fundamentals', type: 'Course', url: 'https://backend.engineering', isFree: true },
        ],
        projects: [
          { title: 'Distributed Microservices System', description: 'Build an API gateway with rate limiting, caching, and database replication.', difficulty: 'Advanced' },
        ],
      },
      {
        title: 'Machine Learning Engineer',
        description: 'Applies statistical models, neural networks, and MLOps pipelines to extract insights and automate tasks.',
        category: 'Artificial Intelligence',
        estimatedMonths: 9,
        averageSalary: '$115,000 - $175,000',
        demandLevel: 'Very High',
        requiredSkills: [
          { skill: 'Python', importance: 0.98 },
          { skill: 'Machine Learning', importance: 0.95 },
          { skill: 'Statistics & Math', importance: 0.9 },
          { skill: 'PyTorch', importance: 0.85 },
          { skill: 'SQL / PostgreSQL', importance: 0.8 },
          { skill: 'Docker', importance: 0.75 },
        ],
        recommendedSkills: [
          { skill: 'AWS / Cloud', importance: 0.7 },
          { skill: 'Deep Learning', importance: 0.8 },
        ],
        learningResources: [
          { title: 'Machine Learning by Stanford', type: 'Course', url: 'https://coursera.org', isFree: true },
        ],
        projects: [
          { title: 'Predictive Customer Churn Pipeline', description: 'End-to-end ML model trained, evaluated, and served via FastAPI.', difficulty: 'Intermediate' },
        ],
      },
      {
        title: 'Data Scientist',
        description: 'Analyzes complex datasets using statistics, machine learning, and visualization to drive strategic decisions.',
        category: 'Data Science',
        estimatedMonths: 7,
        averageSalary: '$105,000 - $160,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'Python', importance: 0.95 },
          { skill: 'Statistics & Math', importance: 0.95 },
          { skill: 'Data Visualization', importance: 0.9 },
          { skill: 'SQL / PostgreSQL', importance: 0.9 },
          { skill: 'Machine Learning', importance: 0.85 },
        ],
        recommendedSkills: [
          { skill: 'PyTorch', importance: 0.6 },
          { skill: 'AWS / Cloud', importance: 0.6 },
        ],
        learningResources: [
          { title: 'Applied Data Science with Python', type: 'Course', url: 'https://coursera.org', isFree: true },
        ],
        projects: [
          { title: 'Market Basket Analysis & Forecasting', description: 'Perform exploratory data analysis and time-series forecasting.', difficulty: 'Intermediate' },
        ],
      },
      {
        title: 'Data Analyst',
        description: 'Translates data into business intelligence, reports, and dashboards to support organizational strategy.',
        category: 'Data Science',
        estimatedMonths: 4,
        averageSalary: '$70,000 - $110,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'SQL / PostgreSQL', importance: 0.95 },
          { skill: 'Data Visualization', importance: 0.9 },
          { skill: 'Python', importance: 0.75 },
          { skill: 'Statistics & Math', importance: 0.8 },
        ],
        recommendedSkills: [
          { skill: 'JavaScript', importance: 0.4 },
        ],
        learningResources: [
          { title: 'Google Data Analytics Professional Certificate', type: 'Course', url: 'https://coursera.org', isFree: false },
        ],
        projects: [
          { title: 'Executive KPI Dashboard', description: 'Create interactive dashboards visualizing revenue trends and user cohorts.', difficulty: 'Beginner' },
        ],
      },
      {
        title: 'DevOps Engineer',
        description: 'Automates CI/CD pipelines, container orchestration, monitoring, and infrastructure deployment.',
        category: 'Cloud Infrastructure',
        estimatedMonths: 7,
        averageSalary: '$105,000 - $165,000',
        demandLevel: 'Very High',
        requiredSkills: [
          { skill: 'Docker', importance: 0.95 },
          { skill: 'Kubernetes', importance: 0.9 },
          { skill: 'AWS / Cloud', importance: 0.9 },
          { skill: 'Git & GitHub', importance: 0.88 },
          { skill: 'Python', importance: 0.75 },
          { skill: 'Node.js', importance: 0.6 },
        ],
        recommendedSkills: [
          { skill: 'Cybersecurity & Security', importance: 0.7 },
          { skill: 'SQL / PostgreSQL', importance: 0.65 },
        ],
        learningResources: [
          { title: 'DevOps Roadmap & Hands-on Guide', type: 'Course', url: 'https://roadmap.sh/devops', isFree: true },
        ],
        projects: [
          { title: 'Automated CI/CD Kubernetes Deployment', description: 'Set up GitHub Actions to build, scan, and deploy microservices to Kubernetes.', difficulty: 'Advanced' },
        ],
      },
      {
        title: 'Cloud Engineer',
        description: 'Architects, secures, and maintains cloud infrastructure environments across AWS, Azure, or GCP.',
        category: 'Cloud Infrastructure',
        estimatedMonths: 6,
        averageSalary: '$100,000 - $155,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'AWS / Cloud', importance: 0.98 },
          { skill: 'Docker', importance: 0.85 },
          { skill: 'Cybersecurity & Security', importance: 0.8 },
          { skill: 'SQL / PostgreSQL', importance: 0.75 },
          { skill: 'Git & GitHub', importance: 0.8 },
        ],
        recommendedSkills: [
          { skill: 'Kubernetes', importance: 0.75 },
          { skill: 'Python', importance: 0.7 },
        ],
        learningResources: [
          { title: 'AWS Certified Solutions Architect Course', type: 'Course', url: 'https://aws.amazon.com/training/', isFree: true },
        ],
        projects: [
          { title: 'Serverless Multi-Region API Backend', description: 'Provision AWS Lambda, DynamoDB, and CloudFront using Infrastructure as Code.', difficulty: 'Intermediate' },
        ],
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Monitors, audits, and secures networks, applications, and cloud environments against threats.',
        category: 'Security',
        estimatedMonths: 6,
        averageSalary: '$90,000 - $145,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'Cybersecurity & Security', importance: 0.98 },
          { skill: 'Python', importance: 0.75 },
          { skill: 'AWS / Cloud', importance: 0.75 },
          { skill: 'SQL / PostgreSQL', importance: 0.7 },
        ],
        recommendedSkills: [
          { skill: 'Docker', importance: 0.65 },
        ],
        learningResources: [
          { title: 'CompTIA Security+ Certification Guide', type: 'Book', url: 'https://cybrary.it', isFree: true },
        ],
        projects: [
          { title: 'Vulnerability Audit & SIEM Dashboard', description: 'Set up log aggregation and automated alert rules for anomalous network activity.', difficulty: 'Intermediate' },
        ],
      },
      {
        title: 'UI/UX Designer',
        description: 'Researches user needs, designs wireframes, prototypes visual interfaces, and crafts intuitive user journeys.',
        category: 'Design',
        estimatedMonths: 4,
        averageSalary: '$80,000 - $130,000',
        demandLevel: 'High',
        requiredSkills: [
          { skill: 'Figma & UI/UX Design', importance: 0.98 },
          { skill: 'JavaScript', importance: 0.5 },
          { skill: 'React', importance: 0.4 },
        ],
        recommendedSkills: [
          { skill: 'Data Visualization', importance: 0.6 },
        ],
        learningResources: [
          { title: 'Google UX Design Professional Certificate', type: 'Course', url: 'https://coursera.org', isFree: false },
        ],
        projects: [
          { title: 'Complete Mobile App Design System', description: 'Create a fully accessible UI component library and interactive prototype in Figma.', difficulty: 'Beginner' },
        ],
      },
    ];

    await Career.insertMany(careersData);
    logger.info(`Inserted ${careersData.length} careers.`);

    // 3. Seed Learning Resources
    const resourcesData = [
      { title: 'JavaScript.info - Modern JS Tutorial', type: 'Article', url: 'https://javascript.info', difficulty: 'Beginner', skillsCovered: ['JavaScript'], isFree: true },
      { title: 'React Documentation and Exercises', type: 'Interactive', url: 'https://react.dev', difficulty: 'Beginner', skillsCovered: ['React', 'JavaScript'], isFree: true },
      { title: 'Node.js Official Documentation & Design Patterns', type: 'Article', url: 'https://nodejs.org', difficulty: 'Intermediate', skillsCovered: ['Node.js', 'Express.js'], isFree: true },
      { title: 'Python Crash Course by Eric Matthes', type: 'Book', url: 'https://nostarch.com/pythoncrashcourse2e', difficulty: 'Beginner', skillsCovered: ['Python'], isFree: false },
      { title: 'FastAI Practical Deep Learning for Coders', type: 'Course', url: 'https://course.fast.ai', difficulty: 'Intermediate', skillsCovered: ['Python', 'Machine Learning', 'PyTorch'], isFree: true },
    ];

    await LearningResource.insertMany(resourcesData);
    logger.info(`Inserted ${resourcesData.length} learning resources.`);

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

// Allow executing script directly via command line
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
