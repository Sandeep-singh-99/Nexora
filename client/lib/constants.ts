import {
  MessageSquare,
  Brain,
  Search,
  Bot,
  Plug,
  LayoutDashboard,
  Globe,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Research", href: "#features" },
  { label: "Knowledge", href: "#features" },
  { label: "Agents", href: "#features" },
];

export interface FeatureItem {
  id: string;
  iconName: string;
  icon: typeof MessageSquare;
  title: string;
  description: string;
  badge?: string;
}

export const FEATURES: FeatureItem[] = [
  {
    id: "ai-chat",
    iconName: "MessageSquare",
    icon: MessageSquare,
    title: "AI Chat",
    description:
      "Have natural conversations with intelligent AI that understands your context and helps you turn ideas into useful answers.",
  },
  {
    id: "knowledge",
    iconName: "Brain",
    icon: Brain,
    title: "Your Knowledge",
    description:
      "Upload documents and build a private knowledge base that your AI can search and understand.",
  },
  {
    id: "deep-research",
    iconName: "Search",
    icon: Search,
    title: "Deep Research",
    description:
      "Break complex questions into research steps, gather evidence, and synthesize findings with citations.",
  },
  {
    id: "ai-agents",
    iconName: "Bot",
    icon: Bot,
    title: "AI Agents",
    description:
      "Let specialized agents reason through tasks, use tools, and complete multi-step workflows.",
  },
  {
    id: "mcp-tools",
    iconName: "Plug",
    icon: Plug,
    title: "MCP Integrations",
    description:
      "Connect AI agents to external tools, databases, repositories, and services through MCP.",
  },
  {
    id: "generative-ui",
    iconName: "LayoutDashboard",
    icon: LayoutDashboard,
    title: "Generative UI",
    description:
      "Turn AI responses into useful tables, charts, cards, sources, forms, and interactive experiences.",
  },
  {
    id: "web-research",
    iconName: "Globe",
    icon: Globe,
    title: "Web Research",
    description:
      "Search the web, analyze relevant sources, and bring fresh information into your AI workflows.",
  },
  {
    id: "team-knowledge",
    iconName: "Users",
    icon: Users,
    title: "Team Knowledge",
    description:
      "Give teams a shared intelligent workspace while keeping knowledge organized and accessible.",
  },
];

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  avatarBg: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Nexora brings research, context, and AI assistance into one place. It feels less like another chatbot and more like a workspace built around how we actually think.",
    name: "Alex Morgan",
    role: "Product Lead",
    company: "Northstar Labs",
    initials: "AM",
    avatarBg: "from-emerald-500 to-teal-600",
  },
  {
    quote:
      "The ability to connect our own knowledge with AI tools changes the workflow completely. We spend less time searching and more time making decisions.",
    name: "Sarah Chen",
    role: "Head of Research",
    company: "Vertex Systems",
    initials: "SC",
    avatarBg: "from-teal-500 to-emerald-400",
  },
  {
    quote:
      "Nexora gives our team a much better way to work with large amounts of information without losing the context behind it.",
    name: "Daniel Brooks",
    role: "Engineering Lead",
    company: "Orbit Labs",
    initials: "DB",
    avatarBg: "from-emerald-600 to-teal-500",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Knowledge", href: "#features" },
      { label: "Research", href: "#features" },
      { label: "Agents", href: "#features" },
      { label: "MCP", href: "#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];
