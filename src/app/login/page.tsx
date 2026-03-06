"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ArrowRight, Loader2 } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                setError("Incorrect password");
                setPassword("");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                        <LockKeyhole className="w-8 h-8 text-primary-400" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Pain Point Engine</h1>
                    <p className="text-white/60 text-sm">Enter the admin password to access the generator.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 text-center text-lg tracking-widest bg-black/50"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-black bg-white hover:bg-white/90 font-bold"
                        disabled={isLoading || !password}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Enter Engine
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
