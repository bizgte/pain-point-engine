"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "🏠", exact: true },
  { href: "/dashboard/posts", label: "Social Posts", icon: "✍️" },
  { href: "/dashboard/blog", label: "Blog", icon: "📝" },
  { href: "/dashboard/email", label: "Email", icon: "📧" },
  { href: "/dashboard/ads", label: "Ad Copy", icon: "📣" },
  { href: "/dashboard/video", label: "Video", icon: "🎬" },
  { href: "/dashboard/image", label: "Images", icon: "🖼️" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "📅" },
  { href: "/dashboard/history", label: "History", icon: "🕒" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-[230px] bg-[#0d0d0d] border-r border-white/10 z-40 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black text-xs">C</div>
            <span className="font-bold text-white">ContEngine</span>
          </Link>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Credits badge */}
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3">
            <div className="text-xs text-white/40 mb-1">Credits remaining</div>
            <div className="text-xl font-black text-white">10</div>
            <div className="text-xs text-white/30 mt-1">Free plan</div>
            <Link
              href="#pricing"
              className="mt-3 block text-center text-xs py-1.5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset for sidebar on desktop */}
      <div className="lg:ml-[230px] flex flex-col min-h-screen">
        {/* Top bar (mobile only) */}
        <header className="h-14 lg:hidden flex items-center px-4 border-b border-white/10 bg-[#0d0d0d]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white mr-4"
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan-500 flex items-center justify-center text-black font-black text-xs">C</div>
            <span className="font-bold text-white text-sm">ContEngine</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
