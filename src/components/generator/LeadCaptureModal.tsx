"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { X, LockKeyhole } from "lucide-react";

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedCount?: number;
}

export function LeadCaptureModal({ isOpen, onClose, onSuccess, selectedCount = 3 }: LeadCaptureModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock webhook submission logic
        setTimeout(() => {
            console.log("Lead captured:", email);
            setLoading(false);
            onSuccess();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-black border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">

                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-900/40 to-transparent pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 relative z-10 text-center">
                    <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LockKeyhole className="w-6 h-6 text-primary-500" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Unlock {selectedCount} Templates</h3>
                    <p className="text-white/60 mb-8 text-sm">
                        Enter your email to instantly unlock and copy your {selectedCount} selected high-converting templates. Look good, sound smart.
                    </p>

                    <form onSubmit={handleSubmit} className="text-left space-y-4">
                        <div>
                            <Label htmlFor="email" className="sr-only">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-white/5 border-white/20 focus:-translate-y-0.5 transition-transform"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 text-base font-semibold"
                            disabled={loading}
                        >
                            {loading ? "Unlocking..." : `Unlock ${selectedCount} Templates`}
                        </Button>
                    </form>

                    <p className="text-xs text-white/40 mt-6 pt-6 border-t border-white/10">
                        By unlocking, you agree to receive tips and template updates from The Smart List.
                    </p>
                </div>
            </div>
        </div>
    );
}
