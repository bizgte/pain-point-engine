import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                            <span className="font-bold text-lg tracking-tight">
                                Template<span className="text-white/60">Engine</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm max-w-sm">
                            Generate industry-specific, pain-point-driven social content templates instantly. Built by The Smart List.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">Product</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li><Link href="/" className="hover:text-white transition-colors">Generator</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">The Smart List</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li><Link href="https://thesmartlist.co" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Main Site</Link></li>
                            <li><Link href="https://thesmartlist.co/services" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="https://thesmartlist.co/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/50">
                    <p>© {new Date().getFullYear()} The Smart List. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="https://thesmartlist.co/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="https://thesmartlist.co/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
