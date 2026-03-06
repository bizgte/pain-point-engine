import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-600/20 p-2 rounded-lg group-hover:bg-primary-600/30 transition-colors">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Cont<span className="text-white/60">Engine</span>
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="https://thesmartlist.co" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Main Site
                    </Link>
                    <Link href="https://thesmartlist.co/services" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Services
                    </Link>
                    <Link href="https://thesmartlist.co/blog" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Blog
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link
                        href="#generate"
                        className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 bg-primary-600 text-white hover:bg-primary-600/90 h-10 px-4 py-2"
                    >
                        Start Generating
                    </Link>
                </div>
            </div>
        </header>
    );
}
