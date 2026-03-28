export type ContentMode =
  | "pain_point"
  | "story"
  | "educational"
  | "entertainment"
  | "brand";

export interface ModeConfig {
  id: ContentMode;
  label: string;
  emoji: string;
  color: string;
  borderColor: string;
  bg: string;
  description: string;
  fields: ModeField[];
}

export interface ModeField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export const CONTENT_MODES: ModeConfig[] = [
  {
    id: "pain_point",
    label: "Pain-Point",
    emoji: "🎯",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    borderColor: "border-red-500",
    description: "Call out the exact pain, then offer relief.",
    fields: [
      { id: "industry", label: "Industry", type: "text", placeholder: "e.g. SaaS, Real Estate", required: true },
      { id: "pain", label: "Core Pain", type: "textarea", placeholder: "What keeps them up at night?", required: true },
      { id: "hook_style", label: "Hook Style", type: "select", options: ["Agitate", "Empathize", "Shock", "Question"], required: false },
    ],
  },
  {
    id: "story",
    label: "Story",
    emoji: "📖",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    borderColor: "border-purple-500",
    description: "Narrative arc that builds emotional connection.",
    fields: [
      { id: "protagonist", label: "Protagonist", type: "text", placeholder: "Who is the story about?", required: true },
      { id: "challenge", label: "Challenge", type: "textarea", placeholder: "What obstacle do they face?", required: true },
      { id: "outcome", label: "Outcome", type: "textarea", placeholder: "How did it resolve?", required: false },
    ],
  },
  {
    id: "educational",
    label: "Educational",
    emoji: "🎓",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.08)",
    borderColor: "border-sky-500",
    description: "Teach something valuable in a shareable format.",
    fields: [
      { id: "topic", label: "Topic", type: "text", placeholder: "e.g. How to reduce churn", required: true },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g. startup founders", required: true },
      { id: "format", label: "Format", type: "select", options: ["List", "How-to", "Myth-bust", "Comparison", "Framework"], required: false },
    ],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    emoji: "🎭",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    borderColor: "border-amber-500",
    description: "Entertain first, sell second.",
    fields: [
      { id: "niche", label: "Niche", type: "text", placeholder: "e.g. fitness, finance", required: true },
      { id: "tone", label: "Tone", type: "select", options: ["Humor", "Sarcasm", "Relatable", "Trending", "Shocking"], required: true },
      { id: "brief", label: "Content Brief", type: "textarea", placeholder: "What should it be about?", required: false },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    emoji: "🏢",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    borderColor: "border-emerald-500",
    description: "Build authority and trust for your brand.",
    fields: [
      { id: "brand_name", label: "Brand Name", type: "text", placeholder: "Your brand or company name", required: true },
      { id: "value_prop", label: "Value Proposition", type: "textarea", placeholder: "What makes you different?", required: true },
      { id: "cta", label: "Call to Action", type: "text", placeholder: "e.g. Book a demo, Try free", required: false },
    ],
  },
];

export function getModeConfig(id: ContentMode): ModeConfig | undefined {
  return CONTENT_MODES.find((m) => m.id === id);
}
