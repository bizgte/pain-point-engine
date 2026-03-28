"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "50,000+", label: "Content Pieces Generated" },
  { value: "120+", label: "Industries Covered" },
  { value: "5", label: "Content Modes" },
  { value: "98%", label: "Positive Feedback" },
];

const INDUSTRIES = [
  "SaaS", "Real Estate", "E-commerce", "Finance", "Healthcare",
  "Education", "Fitness", "Legal", "Marketing", "Consulting",
  "Restaurant", "Travel", "Fashion", "Tech", "Insurance",
];

const MODES = [
  {
    id: "pain_point", emoji: "🎯", label: "Pain-Point",
    color: "#ef4444", bg: "rgba(239,68,68,0.08)",
    desc: "Call out the exact pain, then offer relief. High-conversion hooks.",
  },
  {
    id: "story", emoji: "📖", label: "Story",
    color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",
    desc: "Narrative arc that builds emotional connection and brand loyalty.",
  },
  {
    id: "educational", emoji: "🎓", label: "Educational",
    color: "#0ea5e9", bg: "rgba(14,165,233,0.08)",
    desc: "Teach something valuable in a shareable, authority-building format.",
  },
  {
    id: "entertainment", emoji: "🎭", label: "Entertainment",
    color: "#f59e0b", bg: "rgba(245,158,11,0.08)",
    desc: "Entertain first, sell second. Viral-ready social content.",
  },
  {
    id: "brand", emoji: "🏢", label: "Brand",
    color: "#10b981", bg: "rgba(16,185,129,0.08)",
    desc: "Build authority and trust with polished brand storytelling.",
  },
];

const TOOLS = {
  Written: [
    { name: "Social Post", desc: "Pain-point hooks for any platform", credits: 1, icon: "✍️" },
    { name: "Blog Article", desc: "Long-form SEO-ready content", credits: 3, icon: "📝" },
    { name: "Email Sequence", desc: "Nurture flows that convert", credits: 2, icon: "📧" },
    { name: "Ad Copy", desc: "High-CTR ad creatives", credits: 2, icon: "📣" },
  ],
  Video: [
    { name: "Social Reel", desc: "Pain-point reels + UGC ads", credits: 5, icon: "🎬" },
    { name: "Product Video", desc: "Cinematic product showcases", credits: 5, icon: "🎥" },
    { name: "Story Video", desc: "Brand stories + testimonials", credits: 5, icon: "🎞️" },
    { name: "Educational Clip", desc: "Explainers + documentaries", credits: 5, icon: "🎓" },
  ],
  Visual: [
    { name: "AI Image", desc: "Brand-consistent visuals", credits: 1, icon: "🖼️" },
    { name: "Social Graphic", desc: "Platform-sized graphics", credits: 1, icon: "🎨" },
  ],
  Social: [
    { name: "Content Calendar", desc: "30-day content plans", credits: 5, icon: "📅" },
    { name: "Hashtag Pack", desc: "Reach-maximising tag sets", credits: 1, icon: "#️⃣" },
  ],
};

const FEATURES = [
  {
    title: "5 Content Modes, Infinite Output",
    desc: "Switch between Pain-Point, Story, Educational, Entertainment, and Brand modes — each tuned to a different audience psychology. Our AI adapts tone, structure, and hook formula automatically.",
    gradient: "from-cyan-500 to-blue-600",
    label: "Pain-Point Mode Demo",
    video: "/videos/posts-feature.mp4",
  },
  {
    title: "AI Video Generation Built In",
    desc: "Route your content to the best video AI automatically. WaveSpeed for social reels, Kie Sora-2 for stories, cinematic engine for commercials. Just write the brief — we handle the rest.",
    gradient: "from-purple-500 to-pink-600",
    label: "Video Router Preview",
    video: "/videos/video-feature.mp4",
  },
  {
    title: "Brand DNA Always On",
    desc: "Set your brand voice, tone, and industry once. Every piece of content — from a tweet to a 60-second reel — stays on-brand, every time.",
    gradient: "from-emerald-500 to-cyan-600",
    label: "Brand Settings Demo",
    video: "/videos/blog-feature.mp4",
  },
];

const TEMPLATES = [
  { title: "3 Signs Your [Industry] Is Losing Customers", mode: "Pain-Point" },
  { title: "How I Grew From 0 to 10k Followers in 90 Days", mode: "Story" },
  { title: "5 Things Nobody Tells You About [Topic]", mode: "Educational" },
  { title: "POV: You Finally Fixed [Problem]", mode: "Entertainment" },
  { title: "Why [Brand] Is Different (And Why It Matters)", mode: "Brand" },
  { title: "The #1 Mistake [Audience] Makes With [Topic]", mode: "Pain-Point" },
  { title: "My Client Went From [A] to [B] in 30 Days", mode: "Story" },
  { title: "Thread: Everything Wrong With [Industry]", mode: "Educational" },
];

const FAQS = [
  { q: "What is ContEngine?", a: "ContEngine is an AI content platform that generates industry-specific, pain-point-driven content across 5 psychological modes — written posts, videos, images, and social calendars." },
  { q: "Do I need video API keys to use ContEngine?", a: "No. The text and image tools work immediately. Video generation is activated separately when you add your WaveSpeed or Kie API keys in settings." },
  { q: "What's a credit?", a: "Credits are consumed per generation: posts=1, images=1, emails=2, ads=2, blogs=3, videos=5, calendars=5. Free tier gets 10 credits/month." },
  { q: "How does the video router work?", a: "ContEngine analyses your content mode and quality setting, then automatically routes to the best AI model — WaveSpeed for social reels, Kie Sora-2 for stories, cinematic engine for commercials." },
  { q: "Can I use ContEngine for client work?", a: "Yes. The Pro plan includes 1000 credits/month. You can set separate brand profiles and generate content for multiple clients." },
  { q: "Is my data private?", a: "Yes. We do not use your content or brand data to train any AI models. Your inputs are sent only to the AI provider required for your generation." },
];

const PRICING = [
  {
    name: "Free", monthly: 0, annual: 0, credits: 10,
    features: ["10 credits / month", "All 5 content modes", "Social post generator", "Community support"],
    cta: "Get Started Free", highlight: false,
  },
  {
    name: "Plus", monthly: 19, annual: 149, credits: 200,
    features: ["200 credits / month", "All tools unlocked", "Video generation (bring your keys)", "Brand profile", "Priority support"],
    cta: "Start Plus", highlight: true,
  },
  {
    name: "Pro", monthly: 49, annual: 399, credits: 1000,
    features: ["1,000 credits / month", "Everything in Plus", "30-day content calendar", "Multi-brand profiles", "Dedicated support"],
    cta: "Go Pro", highlight: false,
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function AnnouncementBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative z-50 bg-cyan-500 text-black text-center py-2 px-4 text-sm font-medium">
      🚀 ContEngine v2 is live — 5 content modes, AI video routing, and more.{" "}
      <Link href="/dashboard" className="underline font-bold">Try it free →</Link>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black text-sm">C</div>
          <span className="font-bold text-white text-lg">ContEngine</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#modes" className="hover:text-white transition-colors">Modes</a>
          <a href="#tools" className="hover:text-white transition-colors">Tools</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors hidden md:block">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-sm font-semibold hover:bg-cyan-400 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* BG radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(14,165,233,0.15),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-24">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI Content Platform — 5 Psychological Modes
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
            Content That{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Converts
            </span>
            ,<br />Not Just Fills Feeds
          </h1>

          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-lg">
            Generate pain-point posts, brand stories, educational threads, videos, and social calendars — all tuned to your industry and audience.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/auth/signup"
              className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors text-base"
            >
              Start Free — 10 Credits
            </Link>
            <a
              href="#modes"
              className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:border-white/40 transition-colors text-base"
            >
              See All Modes →
            </a>
          </div>
        </div>

        {/* Right — Video mosaic */}
        <div className="relative w-full">
          <div className="absolute -bottom-1 inset-x-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none rounded-b-2xl" />
          <div className="flex gap-2 h-[320px] overflow-hidden rounded-2xl">
            <video src="/videos/carousel-preview.mp4" autoPlay muted loop playsInline
              className="w-[42%] h-full object-cover rounded-xl flex-shrink-0" />
            <video src="/videos/reel-preview.mp4" autoPlay muted loop playsInline
              className="w-[27%] h-full object-cover rounded-xl flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <video src="/videos/ugc-preview.mp4" autoPlay muted loop playsInline
                className="flex-1 w-full object-cover rounded-xl" style={{objectFit:"cover"}} />
              <video src="/videos/product-video-preview.mp4" autoPlay muted loop playsInline
                className="flex-1 w-full object-cover rounded-xl" style={{objectFit:"cover"}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-sm text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IndustryMarquee() {
  const doubled = [...INDUSTRIES, ...INDUSTRIES];
  return (
    <div className="overflow-hidden py-4 border-b border-white/10">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {doubled.map((ind, i) => (
          <span key={i} className="text-sm text-white/30 font-medium shrink-0 px-2">
            {ind}
          </span>
        ))}
      </div>
    </div>
  );
}

function ModesSection() {
  return (
    <section id="modes" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-white mb-4">5 Content Modes</h2>
        <p className="text-lg text-white/50 max-w-xl mx-auto">
          Each mode uses a different psychological framework — pick the one that fits your goal.
        </p>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MODES.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border p-6 hover:scale-[1.02] transition-transform cursor-pointer"
            style={{
              borderColor: m.color + "40",
              background: m.bg,
            }}
          >
            <div className="text-4xl mb-4">{m.emoji}</div>
            <div className="font-bold text-white mb-2" style={{ color: m.color }}>{m.label}</div>
            <p className="text-sm text-white/50 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolExplorer() {
  const [tab, setTab] = useState<keyof typeof TOOLS>("Written");
  const tabs = Object.keys(TOOLS) as (keyof typeof TOOLS)[];

  return (
    <section id="tools" className="py-24 bg-white/[0.02] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">Every Tool You Need</h2>
          <p className="text-lg text-white/50">Written, video, visual, and social — all in one place.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-cyan-500 text-black"
                  : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tool cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS[tab].map((tool) => (
            <div
              key={tool.name}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-500/40 transition-colors"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <div className="font-bold text-white mb-1">{tool.name}</div>
              <p className="text-sm text-white/50 mb-3">{tool.desc}</p>
              <div className="text-xs text-cyan-400">{tool.credits} credit{tool.credits > 1 ? "s" : ""} / generation</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="space-y-24">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Text — reverse order on odd items */}
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <h3 className="text-3xl font-black text-white mb-4">{f.title}</h3>
              <p className="text-white/60 text-lg leading-relaxed">{f.desc}</p>
            </div>
            {/* Feature video */}
            <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <video
                src={f.video}
                autoPlay muted loop playsInline
                data-scroll-play
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TemplateMarquee() {
  const row1 = [...TEMPLATES, ...TEMPLATES];
  const row2 = [...TEMPLATES.slice(4), ...TEMPLATES.slice(0, 4), ...TEMPLATES.slice(4), ...TEMPLATES.slice(0, 4)];
  return (
    <section className="py-16 overflow-hidden border-y border-white/10 bg-white/[0.02]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white">Templates Ready to Use</h2>
      </div>
      <div className="flex gap-4 animate-marquee mb-4">
        {row1.map((t, i) => (
          <div key={i} className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 min-w-[260px]">
            <div className="text-xs text-cyan-400 mb-2">{t.mode}</div>
            <div className="text-sm text-white font-medium leading-snug">{t.title}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 animate-marquee-reverse">
        {row2.map((t, i) => (
          <div key={i} className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 min-w-[260px]">
            <div className="text-xs text-purple-400 mb-2">{t.mode}</div>
            <div className="text-sm text-white font-medium leading-snug">{t.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white mb-4">Simple Pricing</h2>
        <p className="text-white/50 mb-8">Start free. Scale when you&apos;re ready.</p>
        <div className="inline-flex items-center gap-3 rounded-full border border-white/20 p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? "bg-white text-black" : "text-white/60"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${annual ? "bg-white text-black" : "text-white/60"}`}
          >
            Annual <span className="text-cyan-400 text-xs ml-1">Save ~35%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PRICING.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlight
                ? "border-cyan-500 bg-cyan-500/10 relative"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <div className="text-xl font-black text-white mb-2">{plan.name}</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">
                  ${annual ? (plan.annual === 0 ? 0 : Math.round(plan.annual / 12)) : plan.monthly}
                </span>
                <span className="text-white/40 text-sm mb-2">/mo</span>
              </div>
              {annual && plan.annual > 0 && (
                <div className="text-sm text-cyan-400">${plan.annual}/yr billed annually</div>
              )}
              <div className="text-sm text-white/50 mt-2">{plan.credits} credits / month</div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                plan.highlight
                  ? "bg-cyan-500 text-black hover:bg-cyan-400"
                  : "border border-white/20 text-white hover:border-white/40"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
      <h2 className="text-4xl font-black text-white text-center mb-12">Frequently Asked</h2>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-semibold hover:bg-white/[0.03] transition-colors"
            >
              {faq.q}
              <span className={`text-white/40 transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/10 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-16">
        <h2 className="text-4xl font-black text-white mb-4">Ready to Create Content That Converts?</h2>
        <p className="text-white/60 mb-8 text-lg">Start free. No credit card required. 10 credits on signup.</p>
        <Link
          href="/auth/signup"
          className="inline-block px-8 py-4 rounded-xl bg-cyan-500 text-black font-bold text-lg hover:bg-cyan-400 transition-colors"
        >
          Get Started Free →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black text-sm">C</div>
          <span className="font-bold text-white">ContEngine</span>
        </div>
        <div className="flex gap-8 text-sm text-white/40">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
        <div className="text-sm text-white/30">© 2025 ContEngine. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [banner, setBanner] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {banner && <AnnouncementBanner onDismiss={() => setBanner(false)} />}
      <div className={banner ? "pt-10" : ""}>
        <Navbar scrolled={scrolled} />
        <Hero />
        <StatsRow />
        <IndustryMarquee />
        <ModesSection />
        <ToolExplorer />
        <FeatureShowcase />
        <TemplateMarquee />
        <PricingSection />
        <FAQSection />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}
