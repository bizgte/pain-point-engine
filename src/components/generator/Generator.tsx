"use client";

import { useState } from "react";
import { industries } from "@/data/industries";
import { templates } from "@/data/templates";
import { UserContext, TemplateDefinition } from "@/types";
import { Select } from "@/components/ui/Select";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TemplateRenderer } from "./TemplateRenderer";
import { LeadCaptureModal } from "./LeadCaptureModal";
import { Settings2, LockKeyhole, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export function Generator() {
    const [context, setContext] = useState<UserContext>({
        industryId: "pain_point_engine",
        businessName: "",
        offer: "",
        targetCustomer: "",
        tone: "professional",
        goal: "leads",
        platform: "instagram",
        customVariables: {},
        brandColor: "#0ea5e9", // Default primary-500
        customIndustryName: "", // For when 'custom' is selected
    });

    const [customTemplates, setCustomTemplates] = useState<TemplateDefinition[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPremium, setIsPremium] = useState(false); // Mock Premium State

    // Modals
    const [showPaywallModal, setShowPaywallModal] = useState(false);

    const selectedIndustry = industries.find((i) => i.id === context.industryId) || { id: 'custom', name: context.customIndustryName || 'Custom', icpSummary: "Dynamic AI generation based on industry prompt." };

    // Combine static DB templates + any AI fetched custom ones this session
    const allAvailableTemplates = [...templates, ...customTemplates];
    const relevantTemplates = context.industryId === 'custom'
        ? customTemplates
        : allAvailableTemplates.filter((t) => t.industryId === context.industryId);

    // Only show 3 templates max if not premium
    const displayedTemplates = isPremium ? relevantTemplates : relevantTemplates.slice(0, 3);

    const requiredVariables = displayedTemplates.reduce((acc, template) => {
        template.variables.forEach((v) => {
            if (!acc.some((item) => item.key === v.key)) {
                acc.push(v);
            }
        });
        return acc;
    }, [] as Array<{ key: string; label: string; required?: boolean }>);

    const handleVariableChange = (key: string, value: string) => {
        setContext((prev) => ({
            ...prev,
            customVariables: { ...prev.customVariables, [key]: value },
        }));
    };

    const handleGenerate = async (isAppending: boolean = false) => {
        const generationTarget = context.industryId === 'custom'
            ? context.customIndustryName
            : selectedIndustry.name;

        if (!generationTarget) return;

        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ industryName: generationTarget })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to generate templates.");
            }

            const data = await res.json();

            // Force the generated templates to match the current industry ID so they render properly
            const formattedData = data.map((t: TemplateDefinition) => ({
                ...t,
                industryId: context.industryId
            }));

            if (isAppending) {
                setCustomTemplates(prev => [...prev, ...formattedData]);
            } else {
                setCustomTemplates(formattedData);
            }

        } catch (error: any) {
            console.error("AI Generation failed:", error);
            alert(`Generation failed! Reason: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Image generation moved to template level

    return (
        <div id="generate" className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
                <Settings2 className="w-6 h-6 text-primary-500" />
                <h2 className="text-3xl font-bold tracking-tight">Configure Your Engine</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar - Controls */}
                <div className="lg:col-span-4 space-y-6 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm h-fit sticky top-24">
                    <div className="space-y-4">
                        <div>
                            <Label>Select Your Industry</Label>
                            <Select
                                options={[
                                    ...industries.map((ind) => ({ value: ind.id, label: ind.name })),
                                    { value: 'custom', label: 'Custom (Type your own)' }
                                ]}
                                value={context.industryId}
                                onChange={(e) => {
                                    setContext({ ...context, industryId: e.target.value, customIndustryName: "" });
                                    if (e.target.value !== 'custom') {
                                        setCustomTemplates([]); // clear ai templates when going back to curated
                                    }
                                }}
                            />
                            {context.industryId === 'custom' && (
                                <div className="mt-3">
                                    <Input
                                        placeholder="e.g. Mobile Dog Grooming"
                                        value={context.customIndustryName || ""}
                                        onChange={(e) => setContext({ ...context, customIndustryName: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {selectedIndustry && (
                            <div className="p-4 bg-primary-900/20 border border-primary-500/20 rounded-md text-sm text-primary-100/80 my-4">
                                <strong>Target ICP:</strong> {selectedIndustry.icpSummary}
                            </div>
                        )}

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold mb-4 text-white">Global Brand Assets</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label>Company Slogan / Link</Label>
                                    <Input
                                        placeholder="e.g. www.thesmartlist.co or 'We fix it right!'"
                                        value={context.companySlogan || ""}
                                        onChange={(e) => setContext({ ...context, companySlogan: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Brand Media (Image/Video)</Label>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <Input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        setContext({ ...context, mediaUrl: event.target?.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="text-white/60 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer h-auto py-2"
                                        />
                                    </div>
                                    {context.mediaUrl && (
                                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Global Media attached</div>
                                    )}
                                </div>
                                <div>
                                    <Label>Primary Brand Color</Label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <input
                                            type="color"
                                            value={context.brandColor}
                                            onChange={(e) => setContext({ ...context, brandColor: e.target.value })}
                                            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                                        />
                                        <span className="text-sm font-mono text-white/60">{context.brandColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold mb-2 text-white flex items-center justify-between">
                                <span>Specific Variables</span>
                            </h3>
                            {requiredVariables.length > 0 ? (
                                <div className="space-y-4">
                                    {requiredVariables.map((v) => (
                                        <div key={v.key}>
                                            <Label>{v.label}</Label>
                                            <Input
                                                placeholder={`e.g. My Custom ${v.key}`}
                                                value={context.customVariables?.[v.key] || ""}
                                                onChange={(e) => handleVariableChange(v.key, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-white/50">No specific variables required.</p>
                            )}
                        </div>



                    </div>
                </div>

                {/* Right Content - Rendered Templates */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Generated Content</h3>
                            <p className="text-sm text-white/50 mt-1">You get 3 free templates. Upgrade to access all and continuously generate more.</p>
                        </div>
                        <span className="bg-primary-900/30 text-primary-300 border border-primary-500/20 px-3 py-1 rounded-full text-sm">
                            Showing {displayedTemplates.length} / {relevantTemplates.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {displayedTemplates.map((template) => {
                            return (
                                <div key={template.id} className="relative group/template h-full">
                                    <TemplateRenderer
                                        template={template}
                                        context={context}
                                        isPremium={isPremium}
                                        onUpgradeRequest={() => setShowPaywallModal(true)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {relevantTemplates.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 border border-white/10 border-dashed rounded-xl bg-white/5 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
                            <p className="text-white/60 mb-6 max-w-md">
                                {context.industryId === 'custom'
                                    ? `It looks like you've entered a custom industry. The AI needs to generate the initial Pain Point pack for "${context.customIndustryName || 'your industry'}".`
                                    : `No templates are curated for "${selectedIndustry?.name}" yet. The AI needs to generate the initial Pain Point pack.`}
                            </p>
                            {(context.industryId !== 'custom' || (context.industryId === 'custom' && context.customIndustryName)) && (
                                <Button
                                    className="h-12 px-6"
                                    onClick={() => handleGenerate(false)}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Writing your copy with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2 text-primary-300" />
                                            Generate {context.industryId === 'custom' ? context.customIndustryName : selectedIndustry?.name} Pain Points
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Load More Trigger */}
                    {relevantTemplates.length > 0 && (
                        <div className="mt-12 flex justify-center">
                            <Button
                                variant={isPremium ? "default" : "outline"}
                                size="lg"
                                className={`px-8 h-12 text-base ${!isPremium ? 'border-primary-500/50 hover:bg-primary-500/10' : ''}`}
                                onClick={() => {
                                    if (!isPremium) {
                                        setShowPaywallModal(true);
                                    } else {
                                        handleGenerate(true);
                                    }
                                }}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating More...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 text-primary-400" />
                                        Load More Templates
                                        {!isPremium && <LockKeyhole className="w-4 h-4 ml-2 text-white/50" />}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>



            {/* Paywall Modal */}
            {showPaywallModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-black border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden p-8 text-center">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-900/40 to-transparent pointer-events-none" />

                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Free Limit Reached</h3>
                        <p className="text-white/60 mb-8 text-sm relative z-10">
                            You&apos;ve reached the limits for the free tier. Want to unlock infinite templates and continuous AI generation?
                        </p>

                        <Button
                            size="lg"
                            className="w-full h-12 mb-4 bg-white text-black hover:bg-white/90"
                            onClick={() => {
                                setIsPremium(true);
                                setShowPaywallModal(false);
                                alert("Success! You are now a Premium user. The Load More button is unlocked.");
                            }}
                        >
                            Mock Upgrade to Premium
                        </Button>
                        <Button variant="ghost" className="w-full text-white/60" onClick={() => setShowPaywallModal(false)}>
                            Continue with 3 Templates
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
