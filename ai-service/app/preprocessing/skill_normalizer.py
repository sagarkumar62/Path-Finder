import re
from typing import Dict, Tuple, Optional

# Known domain technology aliases mapping to standard normalized names
KNOWN_ALIASES: Dict[str, str] = {
    "py": "Python",
    "python": "Python",
    "python programming": "Python",
    "python programming language": "Python",
    "python3": "Python",
    "python 3": "Python",
    "js": "JavaScript",
    "javascript": "JavaScript",
    "javascript programming": "JavaScript",
    "es6": "JavaScript",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "react": "React",
    "react.js": "React",
    "reactjs": "React",
    "react js": "React",
    "node": "Node.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "node js": "Node.js",
    "express": "Express.js",
    "express.js": "Express.js",
    "expressjs": "Express.js",
    "express js": "Express.js",
    "next": "Next.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "next js": "Next.js",
    "vue": "Vue.js",
    "vue.js": "Vue.js",
    "vuejs": "Vue.js",
    "vue js": "Vue.js",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "mongo db": "MongoDB",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "dl": "Deep Learning",
    "deep learning": "Deep Learning",
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",
    "pytorch": "PyTorch",
    "tf": "TensorFlow",
    "tensorflow": "TensorFlow",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "docker": "Docker",
    "containerization": "Docker",
    "aws": "Amazon Web Services (AWS)",
    "amazon web services": "Amazon Web Services (AWS)",
    "gcp": "Google Cloud Platform (GCP)",
    "azure": "Microsoft Azure",
}


def normalize_skill_name(raw_name: str) -> Tuple[str, str]:
    """
    Normalizes skill names while preserving raw source attribution.
    Returns a tuple of (normalized_name, raw_name).
    """
    if not raw_name or not isinstance(raw_name, str):
        return ("Unknown", raw_name or "")

    original = raw_name.strip()
    
    # 1. Lowercase for lookup
    clean = original.lower()
    
    # 2. Strip parentheses e.g. "Python (programming)" -> "python programming"
    clean_no_parens = re.sub(r'\(.*?\)', '', clean).strip()
    
    # 3. Check known dictionary aliases
    if clean in KNOWN_ALIASES:
        return (KNOWN_ALIASES[clean], original)
    if clean_no_parens in KNOWN_ALIASES:
        return (KNOWN_ALIASES[clean_no_parens], original)
        
    # 4. Standard suffix removal e.g. "programming language", "programming"
    clean_suffix = re.sub(r'\b(programming language|programming|framework|library|tool|technology|scripting)\b', '', clean_no_parens).strip()
    clean_suffix = re.sub(r'\s+', ' ', clean_suffix)
    
    if clean_suffix in KNOWN_ALIASES:
        return (KNOWN_ALIASES[clean_suffix], original)

    # 5. Fallback title-case normalization for unknown terms
    if clean_suffix:
        # Preserve capitalization of known acronyms like SQL, HTML, CSS
        if clean_suffix in ("sql", "html", "css", "api", "rest", "graphql"):
            return (clean_suffix.upper(), original)
        return (clean_suffix.title(), original)

    return (original.title(), original)
