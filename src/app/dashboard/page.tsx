"use client";

import { useState } from "react";
import Link from "next/link";

const ALL_TOOLS = [
  { name: "Social Posts", icon: "✍️", href: "/dashboard/posts", category: "Written", credits: 1, desc: "Pain-point hooks for any platform" },
  { name: "Blog Article", icon: "📝", href: "/dashboard/blog", category: "Written", credits: 3, desc: "Long-form SEO content" },
  { name: "Email Sequence", icon: "📧", href: "/dashboard/email", category: "Written", credits: 2, desc: "Nurture flows that convert" },
  { name: "Ad Copy", icon: "📣", href: "/dashboard/ads", category: "Written", credits: 2, desc: "High-CTR ad creatives" },
  { name: "Social Reel", icon: "🎬", href: "/dashboard/video", category: "Video", credits: 5, desc: "Pain-point video reels" },
  { name: "Product Video", icon: "🎥", href: "/dashboard/video", category: "Video", credits: 5, desc: "Cinematic product showcase" },
  { name: "AI Image", icon: "🖼️", href: "/dashboard/image", category: "Visual", credits: 1, desc: "Brand-consistent visuals" },
  { name: "Content Calendar", icon: "📅", href: "/dashboard/calendar", category: "Social", credits: 5, desc: "30-day content plans" },
];

const CATEGORIES = ["All", "Written", "Video", "Visual", "Social"];

export default function DashboardHome() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? ALL_TOOLS : ALL_TOOLS.filter((t) => t.category === cat);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">All Tools</h1>
        <p className="text-white/50">Pick a tool and start generating.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              cat === c
                ? "bg-cyan-500 text-black"
                : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all group"
          >
            <div className="text-3xl mb-3">{tool.icon}</div>
            <div className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{tool.name}</div>
            <p className="text-sm text-white/50 mb-3">{tool.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">{tool.category}</span>
              <span className="text-xs text-cyan-400">{tool.credits} cr</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
