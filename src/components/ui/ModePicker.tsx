"use client";

import { CONTENT_MODES } from "@/lib/modeInputSchemas";
import type { ContentMode } from "@/lib/modeInputSchemas";

interface ModePickerProps {
  value: ContentMode;
  onChange: (mode: ContentMode) => void;
}

export function ModePicker({ value, onChange }: ModePickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {CONTENT_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className="rounded-xl border p-3 text-center transition-all hover:scale-[1.02] focus:outline-none"
          style={{
            borderColor: value === m.id ? m.color : "rgba(255,255,255,0.1)",
            background: value === m.id ? m.bg : "transparent",
          }}
          aria-pressed={value === m.id}
          title={m.description}
        >
          <div className="text-2xl mb-1">{m.emoji}</div>
          <div
            className="text-xs font-semibold leading-tight"
            style={{ color: value === m.id ? m.color : "rgba(255,255,255,0.5)" }}
          >
            {m.label}
          </div>
        </button>
      ))}
    </div>
  );
}
