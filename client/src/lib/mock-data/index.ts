import {
  User,
  LearnerProfile,
  CareerRecommendation,
  SkillGapAnalysis,
  Roadmap,
  UserProgress,
  DashboardData,
  AIMessage
} from '@/types';

export const mockUser: User = {
  id: 'usr_101',
  name: 'Sagar Sharma',
  email: 'sagar@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: '2026-08-01T10:00:00Z'
};

export const mockLearnerProfile: LearnerProfile = {
  id: 'prof_101',
  userId: 'usr_101',
  skills: [
    { name: 'JavaScript', proficiency: 'Advanced', category: 'programming' },
    { name: 'React', proficiency: 'Advanced', category: 'framework' },
    { name: 'Node.js', proficiency: 'Intermediate', category: 'framework' },
    { name: 'Python', proficiency: 'Beginner', category: 'programming' },
    { name: 'Git', proficiency: 'Intermediate', category: 'tool' },
    { name: 'MongoDB', proficiency: 'Intermediate', category: 'tool' }
  ],
  interests: ['AI & Machine Learning', 'Web Development', 'Data Science', 'Cloud Architecture'],
  education: 'B.S. in Computer Science',
  experienceLevel: 'Mid',
  targetCareerGoal: 'AI Engineer',
  goalReason: 'I want to build intelligent SaaS applications and master LLM & neural network deployment.',
  learningPreferences: {
    formats: ['Projects', 'Interactive', 'Videos', 'Docs'],
    weeklyHours: 12
  },
  updatedAt: '2026-08-18T10:00:00Z'
};

export const mockCareerRecommendations: CareerRecommendation[] = [
  {
    id: 'car_ai_eng',
    title: 'AI Engineer',
    matchScore: 87,
    difficulty: 'Intermediate',
    estimatedTransition: '6–9 months',
    description: 'Design, build, and deploy production-ready artificial intelligence models, LLM pipelines, and AI-driven applications.',
    whyMatches: [
      'Strong JavaScript & React frontend foundation',
      'Solid understanding of backend APIs with Node.js',
      'High motivation & declared interest in AI & Machine Learning'
    ],
    skillGaps: ['Python (Advanced)', 'Mathematics & Statistics', 'Machine Learning Foundations', 'PyTorch / TensorFlow', 'Vector Databases & RAG'],
    keyResponsibilities: [
      'Fine-tune open-source LLMs for specialized domain tasks',
      'Implement RAG pipelines using Pinecone/Weaviate and LangChain',
      'Deploy scalable model inference endpoints via FastAPI & Docker',
      'Monitor AI performance, latency, and drift'
    ],
    averageSalary: '$135,000 - $185,000 / year'
  },
  {
    id: 'car_fs_dev',
    title: 'Full Stack AI Developer',
    matchScore: 82,
    difficulty: 'Intermediate',
    estimatedTransition: '3–5 months',
    description: 'Combine modern Web Development with AI API integration, building rich reactive web UIs powered by generative AI backends.',
    whyMatches: [
      '90% overlap with your current React & Node.js skillset',
      'Immediate readiness to build AI wrapper SaaS applications',
      'High market demand for frontend engineers with AI capabilities'
    ],
    skillGaps: ['Python Next.js integration', 'Prompt Engineering', 'LangChain / LlamaIndex'],
    keyResponsibilities: [
      'Build rich Next.js frontend interfaces with streaming AI output',
      'Integrate OpenAI, Anthropic, and Gemini APIs safely',
      'Manage MongoDB vector search databases'
    ],
    averageSalary: '$120,000 - $160,000 / year'
  },
  {
    id: 'car_ds',
    title: 'Data Scientist',
    matchScore: 74,
    difficulty: 'Advanced',
    estimatedTransition: '9–12 months',
    description: 'Analyze complex datasets to discover insights, train statistical models, and drive strategic data-driven decisions.',
    whyMatches: [
      'Logical problem-solving mindset',
      'Interest in Data Science & Machine Learning'
    ],
    skillGaps: ['Advanced Statistics & Calculus', 'Pandas / NumPy', 'Scikit-Learn', 'Data Visualization (Seaborn)'],
    keyResponsibilities: [
      'Perform exploratory data analysis on millions of raw records',
      'Build predictive statistical models for business analytics',
      'Communicate insights via executive dashboards'
    ],
    averageSalary: '$125,000 - $170,000 / year'
  }
];

export const mockSkillGapAnalysis: SkillGapAnalysis = {
  careerId: 'car_ai_eng',
  careerTitle: 'AI Engineer',
  matchScore: 87,
  strongCount: 3,
  improvementCount: 2,
  missingCount: 3,
  items: [
    {
      skillName: 'JavaScript & React',
      currentProficiency: 'Advanced',
      requiredProficiency: 'Intermediate',
      priority: 'Low',
      category: 'Strong'
    },
    {
      skillName: 'Node.js & REST APIs',
      currentProficiency: 'Intermediate',
      requiredProficiency: 'Intermediate',
      priority: 'Low',
      category: 'Strong'
    },
    {
      skillName: 'Git & Version Control',
      currentProficiency: 'Intermediate',
      requiredProficiency: 'Intermediate',
      priority: 'Low',
      category: 'Strong'
    },
    {
      skillName: 'Python Programming',
      currentProficiency: 'Beginner',
      requiredProficiency: 'Advanced',
      priority: 'High',
      category: 'Needs Improvement'
    },
    {
      skillName: 'Applied Mathematics & Statistics',
      currentProficiency: 'Beginner',
      requiredProficiency: 'Intermediate',
      priority: 'High',
      category: 'Needs Improvement'
    },
    {
      skillName: 'Machine Learning Algorithms',
      currentProficiency: 'None',
      requiredProficiency: 'Intermediate',
      priority: 'High',
      category: 'Missing'
    },
    {
      skillName: 'PyTorch / Deep Learning Frameworks',
      currentProficiency: 'None',
      requiredProficiency: 'Intermediate',
      priority: 'Medium',
      category: 'Missing'
    },
    {
      skillName: 'Vector DBs & RAG Architecture',
      currentProficiency: 'None',
      requiredProficiency: 'Intermediate',
      priority: 'High',
      category: 'Missing'
    }
  ]
};

export const mockRoadmap: Roadmap = {
  id: 'rdmp_101',
  userId: 'usr_101',
  careerId: 'car_ai_eng',
  careerTitle: 'AI Engineer',
  totalDurationMonths: 7,
  weeklyCommitmentHours: 12,
  overallCompletionPercent: 42,
  currentPhaseNumber: 2,
  updatedAt: '2026-08-18T12:00:00Z',
  adaptiveEvents: [
    {
      date: '2026-08-15',
      reason: 'Adaptive Feedback: Extra time spent practicing Statistics concepts',
      adjustment: 'Phase 2 timeline extended by 1 week to solidify mathematical foundations',
      previousDurationWeeks: 3,
      newDurationWeeks: 4
    }
  ],
  phases: [
    {
      id: 'phase_1',
      phaseNumber: 1,
      title: 'Python Core & Data Structures',
      durationWeeks: 3,
      skillsCovered: ['Python Syntax', 'OOP in Python', 'File I/O', 'Virtual Envs'],
      summary: 'Master Python essentials needed for AI engineering and data manipulation.',
      isCompleted: true,
      isCurrent: false,
      milestones: [
        { id: 'm1', title: 'Complete Python Syntax Fundamentals', description: 'Write scripts using control structures, functions, and list comprehensions.', completed: true },
        { id: 'm2', title: 'Build a CLI Data Processor', description: 'Create a command line script to clean and parse JSON data.', completed: true }
      ],
      resources: [
        { id: 'r1', title: 'Python for Beginners Masterclass', type: 'Video', duration: '4.5 hrs', url: '#', completed: true },
        { id: 'r2', title: 'Python Data Structures Guide', type: 'Docs', duration: '2 hrs', url: '#', completed: true }
      ]
    },
    {
      id: 'phase_2',
      phaseNumber: 2,
      title: 'Mathematics & Statistics for AI',
      durationWeeks: 4,
      skillsCovered: ['Linear Algebra', 'Probability', 'Descriptive Statistics', 'Calculus Basics'],
      summary: 'Build a solid mathematical foundation to understand model optimization and loss functions.',
      isCompleted: false,
      isCurrent: true,
      milestones: [
        { id: 'm3', title: 'Linear Algebra Matrices & Vectors', description: 'Understand dot products, matrix multiplication, and eigenvectors.', completed: true },
        { id: 'm4', title: 'Linear Regression Basics', description: 'Implement cost function and gradient descent from scratch in Python.', completed: false },
        { id: 'm5', title: 'Probability Distributions Quiz', description: 'Master Gaussian distributions and Bayes Theorem.', completed: false }
      ],
      resources: [
        { id: 'r3', title: 'Essence of Linear Algebra (3Blue1Brown)', type: 'Video', duration: '3 hrs', url: '#', completed: true },
        { id: 'r4', title: 'Interactive Gradient Descent Lab', type: 'Interactive', duration: '1.5 hrs', url: '#', completed: false },
        { id: 'r5', title: 'Linear Regression Implementation Guide', type: 'Article', duration: '45 mins', url: '#', completed: false }
      ]
    },
    {
      id: 'phase_3',
      phaseNumber: 3,
      title: 'Machine Learning Fundamentals',
      durationWeeks: 6,
      skillsCovered: ['Supervised Learning', 'Unsupervised Learning', 'Scikit-Learn', 'Model Evaluation'],
      summary: 'Learn classic ML models including Decision Trees, Random Forests, and Clustering.',
      isCompleted: false,
      isCurrent: false,
      milestones: [
        { id: 'm6', title: 'Train a Customer Churn Predictor', description: 'Build an ML model using Scikit-learn with 85%+ accuracy.', completed: false },
        { id: 'm7', title: 'Cross-Validation & Hyperparameter Tuning', description: 'Master GridSearchCV and ROC-AUC curves.', completed: false }
      ],
      resources: [
        { id: 'r6', title: 'Scikit-Learn Crash Course', type: 'Course', duration: '6 hrs', url: '#', completed: false },
        { id: 'r7', title: 'Predictive Analytics Hands-on Project', type: 'Project', duration: '8 hrs', url: '#', completed: false }
      ]
    },
    {
      id: 'phase_4',
      phaseNumber: 4,
      title: 'Deep Learning & Neural Networks',
      durationWeeks: 8,
      skillsCovered: ['Neural Networks', 'PyTorch', 'Transformers', 'Fine-Tuning LLMs'],
      summary: 'Dive deep into neural network architectures, attention mechanisms, and modern LLM pipelines.',
      isCompleted: false,
      isCurrent: false,
      milestones: [
        { id: 'm8', title: 'Build a Neural Network from Scratch', description: 'Implement forward & backward propagation using NumPy.', completed: false },
        { id: 'm9', title: 'Fine-Tune Llama 3 on Custom Dataset', description: 'Use PyTorch & HuggingFace to adapt an open model.', completed: false }
      ],
      resources: [
        { id: 'r8', title: 'Deep Learning with PyTorch', type: 'Course', duration: '12 hrs', url: '#', completed: false },
        { id: 'r9', title: 'Hugging Face Transformers Handbook', type: 'Docs', duration: '5 hrs', url: '#', completed: false }
      ]
    },
    {
      id: 'phase_5',
      phaseNumber: 5,
      title: 'Production AI Capstone & RAG System',
      durationWeeks: 4,
      skillsCovered: ['RAG Architecture', 'Vector Databases', 'FastAPI Deployment', 'Monitoring'],
      summary: 'Ship a full-stack, production-grade AI search and retrieval assistant.',
      isCompleted: false,
      isCurrent: false,
      milestones: [
        { id: 'm10', title: 'Deploy RAG API on Cloud', description: 'Host PyTorch inference endpoint with Pinecone vector search.', completed: false }
      ],
      resources: [
        { id: 'r10', title: 'Building Production RAG Applications', type: 'Project', duration: '15 hrs', url: '#', completed: false }
      ]
    }
  ]
};

export const mockDashboardData: DashboardData = {
  user: mockUser,
  activeGoal: {
    careerId: 'car_ai_eng',
    title: 'AI Engineer',
    matchScore: 87,
    estimatedMonths: 7
  },
  currentProgress: {
    overallCompletionPercent: 42,
    learningHours: 38.5,
    streakDays: 6
  },
  currentPhase: {
    phaseNumber: 2,
    title: 'Mathematics & Statistics for AI',
    progressPercent: 75
  },
  nextAction: {
    id: 'm4',
    title: 'Complete: Linear Regression Basics',
    phaseTitle: 'Phase 2: Mathematics & Statistics for AI',
    estimatedMinutes: 45,
    resourceType: 'Interactive Lab'
  },
  skillGapSummary: {
    strong: 3,
    needsWork: 2,
    missing: 3
  },
  recommendedResources: [
    { id: 'rec_1', title: 'Interactive Gradient Descent Simulator', type: 'Course', tag: 'High Priority', duration: '45 mins' },
    { id: 'rec_2', title: 'Build a Sentiment Analysis API in PyTorch', type: 'Project', tag: 'Hands-on', duration: '3.5 hrs' },
    { id: 'rec_3', title: 'Vector Database (Pinecone) Cheat Sheet', type: 'Skill', tag: 'Architecture', duration: '15 mins' },
    { id: 'rec_4', title: 'Top 10 AI Engineer Interview Questions', type: 'Article', tag: 'Career', duration: '20 mins' }
  ]
};

export const mockUserProgress: UserProgress = {
  id: 'prog_101',
  userId: 'usr_101',
  totalLearningHours: 38.5,
  currentStreakDays: 6,
  completedMilestonesCount: 3,
  acquiredSkillsCount: 5,
  completedProjectsCount: 2,
  recentActivity: [
    { id: 'act_1', title: 'Completed "Linear Algebra Matrices & Vectors" lesson', type: 'Milestone', timestamp: 'Today, 2:30 PM' },
    { id: 'act_2', title: 'Finished 3Blue1Brown Vectors video series', type: 'Video', timestamp: 'Yesterday, 8:15 PM' },
    { id: 'act_3', title: 'Adaptive AI adjusted Statistics phase duration (+1 week)', type: 'System', timestamp: '3 days ago' },
    { id: 'act_4', title: 'Passed Python Data Structures Quiz (100%)', type: 'Quiz', timestamp: '5 days ago' }
  ]
};

export const mockInitialMessages: AIMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    content: "Hello Sagar! 👋 I'm **CareerPath AI**, your personal AI career guide. I notice you're working through Phase 2 of your **AI Engineer** path (*Mathematics & Statistics*). How can I assist your career growth today?",
    timestamp: 'Just now'
  }
];
