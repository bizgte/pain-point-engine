"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    industry: "",
    tone: "",
    audience: "",
    valueProps: "",
    competitors: "",
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: persist to Supabase once connected
    localStorage.setItem("contengine_brand", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Brand Settings</h1>
        <p className="text-white/50">Your brand DNA — used to personalise all generated content.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
        {[
          { id: "brandName", label: "Brand / Company Name", placeholder: "e.g. Acme Inc" },
          { id: "industry", label: "Industry", placeholder: "e.g. SaaS, Real Estate, E-commerce" },
          { id: "tone", label: "Brand Tone", placeholder: "e.g. Professional, Casual, Bold, Friendly" },
          { id: "audience", label: "Target Audience", placeholder: "e.g. Startup founders aged 25-40" },
        ].map((field) => (
          <div key={field.id}>
            <label className="block text-sm text-white/70 mb-2">{field.label}</label>
            <input
              type="text"
              value={form[field.id as keyof typeof form]}
              onChange={(e) => setForm((p) => ({ ...p, [field.id]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        ))}

        {[
          { id: "valueProps", label: "Value Propositions", placeholder: "What makes you different? (one per line)" },
          { id: "competitors", label: "Competitors (optional)", placeholder: "Names of competitors, one per line" },
        ].map((field) => (
          <div key={field.id}>
            <label className="block text-sm text-white/70 mb-2">{field.label}</label>
            <textarea
              value={form[field.id as keyof typeof form]}
              onChange={(e) => setForm((p) => ({ ...p, [field.id]: e.target.value }))}
              placeholder={field.placeholder}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
        >
          {saved ? "✓ Saved!" : "Save Brand Profile"}
        </button>
      </form>
    </div>
  );
}
