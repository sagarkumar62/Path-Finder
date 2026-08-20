from typing import Dict, List, Set, Any, Optional
from collections import defaultdict, deque

# Curated Baseline Skill Prerequisites Graph (Directed Acyclic Graph)
CURATED_PREREQUISITES: Dict[str, List[str]] = {
    "NumPy": ["Python"],
    "Pandas": ["Python", "NumPy"],
    "Data Analysis": ["Python", "Pandas"],
    "Statistics": ["Python"],
    "Machine Learning": ["Python", "Statistics", "NumPy"],
    "Deep Learning": ["Machine Learning", "Python"],
    "PyTorch": ["Deep Learning", "Python"],
    "TensorFlow": ["Deep Learning", "Python"],
    "MLOps": ["Machine Learning", "Docker", "Python"],
    "Transformers": ["Deep Learning", "PyTorch"],
    "LLM Engineering": ["Transformers", "PyTorch"],
    
    "TypeScript": ["JavaScript"],
    "React": ["JavaScript", "HTML/CSS"],
    "Next.js": ["React", "TypeScript"],
    "Node.js": ["JavaScript"],
    "Express.js": ["Node.js", "JavaScript"],
    "MongoDB": ["Node.js"],
    "PostgreSQL": ["SQL"],
    "System Architecture": ["Node.js", "Express.js", "MongoDB"],
    "Microservices": ["System Architecture", "Docker"],
    
    "Kubernetes": ["Docker"],
    "CI/CD": ["Git", "Docker"],
    "DevOps": ["Linux", "Docker", "CI/CD"],
}


class SkillGraph:
    def __init__(self):
        # adj[A] = list of skills B where A is a prerequisite for B
        self.adj: Dict[str, List[str]] = defaultdict(list)
        # in_degree[B] = count of prerequisites for B
        self.in_degree: Dict[str, int] = defaultdict(int)
        # prerequisites[B] = list of A needed before B
        self.prereqs: Dict[str, List[str]] = defaultdict(list)
        self._build_curated_graph()

    def _build_curated_graph(self):
        for skill, prereq_list in CURATED_PREREQUISITES.items():
            for p in prereq_list:
                self.add_prerequisite(prereq=p, target_skill=skill)

    def add_prerequisite(self, prereq: str, target_skill: str):
        """Adds a directed edge: prereq -> target_skill."""
        if target_skill not in self.prereqs[target_skill]:
            self.prereqs[target_skill].append(prereq)
            self.adj[prereq].append(target_skill)
            self.in_degree[target_skill] += 1
            if prereq not in self.in_degree:
                self.in_degree[prereq] = 0

    def detect_cycle(self) -> bool:
        """
        Detects if the skill graph contains any cyclic dependencies using Kahn's Algorithm.
        Returns True if a cycle exists, False if the graph is a valid DAG.
        """
        in_deg = self.in_degree.copy()
        all_nodes = set(in_deg.keys())
        for u in self.adj:
            all_nodes.add(u)

        queue = deque([node for node in all_nodes if in_deg[node] == 0])
        visited_count = 0

        while queue:
            node = queue.popleft()
            visited_count += 1
            for neighbor in self.adj[node]:
                in_deg[neighbor] -= 1
                if in_deg[neighbor] == 0:
                    queue.append(neighbor)

        return visited_count < len(all_nodes)

    def get_prerequisites(self, skill: str) -> List[str]:
        """Returns direct prerequisites for a skill."""
        return self.prereqs.get(skill, [])

    def get_all_ancestor_prerequisites(self, skill: str) -> List[str]:
        """Recursively retrieves all upstream prerequisite skills."""
        ancestors = []
        visited = set()

        def dfs(curr: str):
            for p in self.prereqs.get(curr, []):
                if p not in visited:
                    visited.add(p)
                    ancestors.append(p)
                    dfs(p)

        dfs(skill)
        return ancestors

    def topological_sort_skills(self, skills: List[str]) -> List[str]:
        """
        Sorts a list of target skills according to topological prerequisite ordering.
        Missing root prerequisites come first.
        """
        skill_set = set(skills)
        # Expand skill set with upstream ancestors
        expanded = set(skills)
        for s in skills:
            for anc in self.get_all_ancestor_prerequisites(s):
                expanded.add(anc)

        # Build subgraph in-degrees
        sub_in_deg = {s: 0 for s in expanded}
        sub_adj = defaultdict(list)

        for s in expanded:
            for p in self.prereqs.get(s, []):
                if p in expanded:
                    sub_adj[p].append(s)
                    sub_in_deg[s] += 1

        queue = deque([s for s in expanded if sub_in_deg[s] == 0])
        ordered = []

        while queue:
            node = queue.popleft()
            ordered.append(node)
            for neighbor in sub_adj[node]:
                sub_in_deg[neighbor] -= 1
                if sub_in_deg[neighbor] == 0:
                    queue.append(neighbor)

        # Fallback to original list if cycle or disconnected
        for s in skills:
            if s not in ordered:
                ordered.append(s)

        return ordered


_global_skill_graph = SkillGraph()


def get_skill_graph() -> SkillGraph:
    return _global_skill_graph
