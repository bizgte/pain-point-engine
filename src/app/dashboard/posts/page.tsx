"use client";

import { useState } from "react";
import { CONTENT_MODES } from "@/lib/modeInputSchemas";

export default function PostsPage() {
  const [mode, setMode] = useState("pain_point");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const currentMode = CONTENT_MODES.find((m) => m.id === mode)!;

  async function handleGenerate() {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...formData }),
      });
      const data = await res.json();
      setOutput(data.content ?? data.output ?? JSON.stringify(data));
    } catch {
      setOutput("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Social Posts</h1>
        <p className="text-white/50">Choose a content mode, fill in the details, generate.</p>
      </div>

      {/* Mode Picker */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {CONTENT_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setFormData({}); }}
            className="rounded-xl border p-3 text-center transition-all hover:scale-[1.02]"
            style={{
              borderColor: mode === m.id ? m.color : "rgba(255,255,255,0.1)",
              background: mode === m.id ? m.bg : "transparent",
            }}
          >
            <div className="text-2xl mb-1">{m.emoji}</div>
            <div className="text-xs font-semibold" style={{ color: mode === m.id ? m.color : "rgba(255,255,255,0.5)" }}>
              {m.label}
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic fields */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <h2 className="font-bold text-white mb-5">{currentMode.emoji} {currentMode.label} Mode</h2>
        <div className="space-y-4">
          {currentMode.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm text-white/70 mb-2">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.id] ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.id] ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData[field.id] ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Generated Content</h3>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{output}</div>
        </div>
      )}
    </div>
  );
}
