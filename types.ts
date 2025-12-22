
export interface Skill {
  name: string;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  context: string;
  solution: string;
  tech: string[];
  impact: string;
  link?: string;
  image: string;
}

export interface AutomationTool {
  title: string;
  description: string;
  icon: string;
  link?: string;
}
