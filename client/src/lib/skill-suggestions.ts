export interface SuggestedSkill {
  name: string;
  reason: string;
  source: 'goal' | 'interest';
}

/**
 * Benchmark Career to Skills Mapping
 */
export const CAREER_SKILLS_MAP: Record<string, { required: string[]; recommended: string[] }> = {
  'ai engineer': {
    required: ['Python', 'Machine Learning', 'PyTorch', 'Large Language Models (LLMs)', 'Generative AI', 'REST & GraphQL APIs'],
    recommended: ['Docker', 'LangChain', 'FastAPI', 'Statistics & Mathematics']
  },
  'machine learning engineer': {
    required: ['Python', 'Machine Learning', 'Scikit-Learn', 'PyTorch', 'TensorFlow', 'Statistics & Mathematics', 'Docker'],
    recommended: ['Kubernetes', 'MLOps', 'PostgreSQL', 'C++']
  },
  'data scientist': {
    required: ['Python', 'Pandas', 'NumPy', 'Statistics & Mathematics', 'Machine Learning', 'PostgreSQL'],
    recommended: ['R', 'Tableau', 'Scikit-Learn', 'A/B Testing']
  },
  'data analyst': {
    required: ['SQL', 'PostgreSQL', 'Python', 'Pandas', 'Statistics & Mathematics'],
    recommended: ['Tableau', 'Power BI', 'Excel', 'Data Visualization']
  },
  'full stack developer': {
    required: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'],
    recommended: ['Next.js', 'Tailwind CSS', 'Docker', 'REST & GraphQL APIs']
  },
  'frontend developer': {
    required: ['JavaScript', 'TypeScript', 'React.js', 'HTML/CSS', 'Tailwind CSS'],
    recommended: ['Next.js', 'Vue.js', 'Figma', 'Web Performance Optimization']
  },
  'backend developer': {
    required: ['Node.js', 'Express.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST & GraphQL APIs'],
    recommended: ['Go', 'Redis', 'Docker', 'CI/CD Pipelines']
  },
  'mobile developer': {
    required: ['JavaScript', 'TypeScript', 'React Native', 'REST & GraphQL APIs'],
    recommended: ['Kotlin', 'Swift', 'Flutter', 'Mobile UI Design']
  },
  'devops engineer': {
    required: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Git / GitHub', 'AWS', 'Python'],
    recommended: ['Terraform', 'Linux', 'Bash', 'Prometheus']
  },
  'cloud engineer': {
    required: ['AWS', 'Microsoft Azure', 'Docker', 'Git / GitHub', 'Network Security'],
    recommended: ['Google Cloud Platform', 'Terraform', 'Python']
  },
  'cybersecurity analyst': {
    required: ['Cybersecurity Fundamentals', 'Network Security', 'Penetration Testing', 'Ethical Hacking', 'Python'],
    recommended: ['Linux', 'SIEM Tools', 'Cryptography']
  },
  'ui/ux designer': {
    required: ['Figma', 'UI/UX Design', 'Wireframing & Prototyping', 'HTML/CSS'],
    recommended: ['User Research', 'Design Systems', 'Tailwind CSS']
  }
};

/**
 * Interest to Skills Mapping
 */
export const INTEREST_SKILLS_MAP: Record<string, string[]> = {
  'ai & machine learning': ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Large Language Models (LLMs)', 'Scikit-Learn'],
  'artificial intelligence': ['Python', 'PyTorch', 'Generative AI', 'LangChain', 'Neural Networks'],
  'web development': ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Next.js', 'HTML/CSS', 'Tailwind CSS'],
  'frontend web development': ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML/CSS'],
  'backend & systems api architecture': ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'REST & GraphQL APIs', 'Docker'],
  'data science & analytics': ['Python', 'Pandas', 'NumPy', 'Statistics & Mathematics', 'SQL', 'Tableau'],
  'cloud architecture & devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Terraform', 'Linux'],
  'cybersecurity': ['Cybersecurity Fundamentals', 'Network Security', 'Penetration Testing', 'Ethical Hacking', 'Linux'],
  'mobile app development': ['React Native', 'TypeScript', 'Mobile UI Design', 'Swift', 'Kotlin'],
  'ui/ux design': ['Figma', 'Wireframing & Prototyping', 'User Research', 'Design Systems']
};

export interface GetSuggestionsOptions {
  targetGoal?: string;
  interests?: string[];
  existingSkills?: string[];
  limit?: number;
}

/**
 * Calculates dynamic skill suggestions based on Target Career Goal & Interests
 */
export function getSkillSuggestions({
  targetGoal = '',
  interests = [],
  existingSkills = [],
  limit = 12
}: GetSuggestionsOptions): SuggestedSkill[] {
  const normalizedExisting = existingSkills.map(s => s.trim().toLowerCase());
  const suggestionsMap = new Map<string, SuggestedSkill>();

  const normalizedGoal = targetGoal.trim().toLowerCase();

  // 1. Match Career Goal Skills
  let goalKey = Object.keys(CAREER_SKILLS_MAP).find(
    k => normalizedGoal.includes(k) || k.includes(normalizedGoal)
  );

  if (goalKey && CAREER_SKILLS_MAP[goalKey]) {
    const careerObj = CAREER_SKILLS_MAP[goalKey];
    const displayGoalName = targetGoal.trim() || 'Target Goal';

    // Required skills
    careerObj.required.forEach(skill => {
      const lower = skill.toLowerCase();
      if (!normalizedExisting.includes(lower) && !suggestionsMap.has(lower)) {
        suggestionsMap.set(lower, {
          name: skill,
          reason: `Required for ${displayGoalName}`,
          source: 'goal'
        });
      }
    });

    // Recommended skills
    careerObj.recommended.forEach(skill => {
      const lower = skill.toLowerCase();
      if (!normalizedExisting.includes(lower) && !suggestionsMap.has(lower)) {
        suggestionsMap.set(lower, {
          name: skill,
          reason: `Recommended for ${displayGoalName}`,
          source: 'goal'
        });
      }
    });
  }

  // 2. Match Interest Skills
  interests.forEach(interest => {
    const normInterest = interest.trim().toLowerCase();
    const matchKey = Object.keys(INTEREST_SKILLS_MAP).find(
      k => normInterest.includes(k) || k.includes(normInterest)
    );

    if (matchKey && INTEREST_SKILLS_MAP[matchKey]) {
      INTEREST_SKILLS_MAP[matchKey].forEach(skill => {
        const lower = skill.toLowerCase();
        if (!normalizedExisting.includes(lower) && !suggestionsMap.has(lower)) {
          suggestionsMap.set(lower, {
            name: skill,
            reason: `Matches interest in ${interest}`,
            source: 'interest'
          });
        }
      });
    }
  });

  // 3. Convert Map to Array & Slice to Limit
  const result = Array.from(suggestionsMap.values());
  return limit ? result.slice(0, limit) : result;
}
