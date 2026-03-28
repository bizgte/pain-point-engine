import Link from "next/link";

export default function EmailSequencesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-5xl mb-4">📧</div>
      <h1 className="text-2xl font-black text-white mb-3">Email Sequences</h1>
      <p className="text-white/40 max-w-sm mb-8">Email sequence builder coming soon. Nurture flows, welcome sequences, and sales emails.</p>
      <Link
        href="/dashboard/posts"
        className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors text-sm"
      >
        Use Social Posts Now →
      </Link>
    </div>
  );
}
