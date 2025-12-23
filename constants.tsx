
import { Brain, Cpu, Database, Globe, Layers, Settings, Terminal, Zap } from 'lucide-react';
import { Project, Skill, AutomationTool } from './types';

export const SKILLS: Skill[] = [
  // GenAI & Agents
  { name: 'LLMs', category: 'GenAI & Agents' },
  { name: 'Generative AI', category: 'GenAI & Agents' },
  { name: 'LangGraph', category: 'GenAI & Agents' },
  { name: 'RAG Architecture', category: 'GenAI & Agents' },
  { name: 'Multi-Agent Logic', category: 'GenAI & Agents' },
  { name: 'Prompt Eng.', category: 'GenAI & Agents' },
  
  // Backend & Systems
  { name: 'FastAPI', category: 'Backend & Systems' },
  { name: 'Flask', category: 'Backend & Systems' },
  { name: 'C++ Systems', category: 'Backend & Systems' },
  { name: 'MySQL', category: 'Backend & Systems' },
  { name: 'JWT/Auth', category: 'Backend & Systems' },
  { name: 'API Architecture', category: 'Backend & Systems' },
  { name: 'Supabase', category: 'Backend & Systems' },

  // Automation & Data Ops
  { name: 'n8n Workflow', category: 'Automation & Data Ops' },
  { name: 'Pandas', category: 'Automation & Data Ops' },
  { name: 'Numpy', category: 'Automation & Data Ops' },
  { name: 'Playwright', category: 'Automation & Data Ops' },
  { name: 'Linux CLI', category: 'Automation & Data Ops' },
  { name: 'CI/CD Actions', category: 'Automation & Data Ops' },

  // AI & Data Intelligence
  { name: 'Deep Learning', category: 'AI & Data Intelligence' },
  { name: 'Computer Vision', category: 'AI & Data Intelligence' },
  { name: 'Transformer Arch.', category: 'AI & Data Intelligence' },
  { name: 'Data Analysis', category: 'AI & Data Intelligence' },
  { name: 'Power BI', category: 'AI & Data Intelligence' },
];

export const PROJECTS: Project[] = [
  {
    id: '3d-cargo',
    title: '3D Cargo Loader Pro',
    subtitle: 'Spatial Optimization Engine',
    context: 'Logistic inefficiencies cost companies billions in wasted cargo space.',
    solution: 'Built a 3D packing algorithm that calculates optimal load distributions with real-time constraint satisfaction.',
    tech: ['Python', 'Spatial Algos', 'FastAPI', 'Spatial Engine'],
    impact: 'Calculates optimal load distribution in <200ms.',
    link: 'https://arrangeurload.live',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'textile-intel',
    title: 'TextileIntel',
    subtitle: 'News Intelligence Automation',
    context: 'The textile industry is fragmented with news scattered across hundreds of sources.',
    solution: 'An end-to-end automated pipeline that scrapes, summarizes (using LLMs), and categorizes global textile news.',
    tech: ['Playwright', 'Gemini API', 'n8n', 'React'],
    impact: 'Consolidates 500+ global sources into real-time insights.',
    link: 'https://live-conscious.in',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'smart-sales',
    title: 'Smart Sales Automation',
    subtitle: 'Agentic Workflows',
    context: 'Manual lead generation and social outreach are time-consuming and inefficient.',
    solution: 'Built a smart sales automation system using Playwright for content scraping, Telegram agents for real-time alerts, and social media integration to automate the entire sales cycle.',
    tech: ['Playwright', 'Telegram API', 'Python', 'Social Automation'],
    impact: 'End-to-end automated sales pipeline with zero manual intervention.',
    link: 'https://github.com/Ambujkumar909/smart-sales-automation',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop'
  }
];

export const AUTOMATION_TOOLS: AutomationTool[] = [
  {
    title: 'System Utilities',
    description: 'High-speed Batch File Renamers and Intelligent File Organizers built for scale (Python/CLI).',
    icon: 'Terminal',
    link: 'https://github.com/Ambujkumar909/Batch-file-renamer'
  },
  {
    title: 'Content Pipelines',
    description: 'Automated systems that generate, edit, and post media content across multiple platforms autonomously.',
    icon: 'Zap',
    link: 'https://github.com/Ambujkumar909/twitter-automation'
  },
  {
    title: 'Logistic Pipelines',
    description: 'Custom business automations that sync inventory with shipping data through modular middleware.',
    icon: 'Layers',
    link: 'https://github.com/Ambujkumar909/Invoice_ocr_automation'
  }
];
