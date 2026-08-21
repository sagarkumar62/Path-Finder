/**
 * Skill Taxonomy & Normalization Engine
 * Maps skill variations, acronyms, and formatting inconsistencies to standardized skill names.
 */

const SKILL_ALIASES: Record<string, string> = {
  // Programming Languages
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python3': 'Python',
  'python': 'Python',
  'cpp': 'C++',
  'cplusplus': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'golang': 'Go',
  'go lang': 'Go',
  'java': 'Java',
  'ruby': 'Ruby',
  'php': 'PHP',
  'rust': 'Rust',
  'kotlin': 'Kotlin',
  'swift': 'Swift',

  // Web Frameworks & Libraries
  'react': 'React.js',
  'reactjs': 'React.js',
  'react.js': 'React.js',
  'react native': 'React Native',
  'next': 'Next.js',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'nest': 'NestJS',
  'nestjs': 'NestJS',
  'fastapi': 'FastAPI',
  'django': 'Django',
  'flask': 'Flask',
  'spring': 'Spring Boot',
  'springboot': 'Spring Boot',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',

  // Databases & Storage
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'psql': 'PostgreSQL',
  'mysql': 'MySQL',
  'redis': 'Redis',
  'sqlite': 'SQLite',
  'dynamodb': 'DynamoDB',

  // AI / ML / Data Science
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'ai': 'Artificial Intelligence',
  'artificial intelligence': 'Artificial Intelligence',
  'pytorch': 'PyTorch',
  'torch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'tf': 'TensorFlow',
  'scikit-learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'keras': 'Keras',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scipy': 'SciPy',
  'nlp': 'Natural Language Processing',
  'natural language processing': 'Natural Language Processing',
  'cv': 'Computer Vision',
  'computer vision': 'Computer Vision',
  'genai': 'Generative AI',
  'generative ai': 'Generative AI',
  'llm': 'Large Language Models (LLMs)',
  'llms': 'Large Language Models (LLMs)',

  // DevOps & Cloud
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'azure': 'Microsoft Azure',
  'gcp': 'Google Cloud Platform',
  'docker': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'cicd': 'CI/CD Pipelines',
  'ci/cd': 'CI/CD Pipelines',
  'git': 'Git / GitHub',
  'github': 'Git / GitHub',
  'terraform': 'Terraform',

  // Cybersecurity
  'cybersecurity': 'Cybersecurity Fundamentals',
  'cyber security': 'Cybersecurity Fundamentals',
  'ethical hacking': 'Ethical Hacking',
  'penetration testing': 'Penetration Testing',
  'network security': 'Network Security',

  // Design & UI/UX
  'figma': 'Figma',
  'ui/ux': 'UI/UX Design',
  'ui design': 'UI/UX Design',
  'ux design': 'UI/UX Design',
  'wireframing': 'Wireframing & Prototyping',

  // Statistics & Math
  'math': 'Statistics & Mathematics',
  'mathematics': 'Statistics & Mathematics',
  'stats': 'Statistics & Mathematics',
  'statistics': 'Statistics & Mathematics',
  'linear algebra': 'Linear Algebra'
};

/**
 * Normalizes a single skill string to standard representation.
 */
export function normalizeSkill(skill: string): string {
  if (!skill || typeof skill !== 'string') return '';
  const trimmed = skill.trim().toLowerCase();
  if (SKILL_ALIASES[trimmed]) {
    return SKILL_ALIASES[trimmed];
  }
  // Return Title Case representation for unmapped skills
  return skill
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Normalizes an array of skills, removing duplicates.
 */
export function normalizeSkills(skills: (string | { name: string })[]): string[] {
  if (!Array.isArray(skills)) return [];
  const normalizedSet = new Set<string>();

  for (const s of skills) {
    const raw = typeof s === 'string' ? s : s?.name;
    if (raw) {
      const norm = normalizeSkill(raw);
      if (norm) {
        normalizedSet.add(norm);
      }
    }
  }

  return Array.from(normalizedSet);
}
