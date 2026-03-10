"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, Copy, CheckCircle2, Download, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { TemplateDefinition, UserContext } from "@/types";
import { toPng } from 'html-to-image';

interface TemplateRendererProps {
    template: TemplateDefinition;
    context: UserContext;
    isPremium?: boolean;
    onUpgradeRequest?: () => void;
}

export function TemplateRenderer({
    template,
    context,
    isPremium = false,
    onUpgradeRequest
}: TemplateRendererProps) {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [layout, setLayout] = useState<'split' | 'stacked'>('split');
    const [localMediaUrl, setLocalMediaUrl] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const effectiveMediaUrl = localMediaUrl || context.mediaUrl;

    const injectVariables = (text: string) => {
        let result = text;
        template.variables.forEach((v) => {
            const value = context.customVariables?.[v.key] || `[${v.label}]`;
            result = result.replace(new RegExp(`{{${v.key}}}`, "g"), value);
        });
        return result;
    };

    const generateFullText = () => {
        let text = template.deepDiveCaption || template.blocks
            .map((block) => {
                if (block.kind === "bullets") {
                    return block.items.map((item) => `- ${injectVariables(item)}`).join("\n");
                }
                return injectVariables(block.text);
            })
            .join("\n\n");

        if (context.companySlogan) {
            text += `\n\n${context.companySlogan}`;
        }

        return injectVariables(text);
    };

    const handleGenerateLocalImage = async (e: React.MouseEvent) => {
        e.stopPropagation();

        setIsGeneratingImage(true);
        try {
            const promptContext = Object.values(context.customVariables || {}).join(", ");
            const specificPrompt = `${template.name}. Specifically showing: ${promptContext}`;
            const targetIndustry = context.industryId === 'custom' ? (context.customIndustryName || "Industry") : "Industry";

            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    industryName: targetIndustry,
                    prompt: specificPrompt
                })
            });

            if (!res.ok) throw new Error("Failed to generate image.");

            const data = await res.json();
            if (data.imageUrl) {
                setLocalMediaUrl(data.imageUrl);
            }
        } catch (error) {
            console.error(error);
            alert("Sorry, we couldn't generate the image right now.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadImage = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (printRef.current === null) return;
        setDownloading(true);

        try {
            // Small timeout to ensure fonts load if necessary
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(printRef.current, { cacheBust: true, pixelRatio: 2 });

            const link = document.createElement('a');
            link.download = `${template.id}-post.png`;
            link.href = dataUrl;
            link.click();

            // Also download the text file
            const fullText = generateFullText();
            const textBlob = new Blob([fullText], { type: 'text/plain' });
            const textUrl = URL.createObjectURL(textBlob);
            const textLink = document.createElement('a');
            textLink.download = `${template.id}-caption.txt`;
            textLink.href = textUrl;
            textLink.click();
            URL.revokeObjectURL(textUrl);

        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <>
            <Card
                className={`flex flex-col h-full transition-all duration-300 bg-black/40 border-white/5 hover:border-white/20`}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-white/70 rounded-full uppercase tracking-wider">
                            {template.type}
                        </span>
                        <h4 className="font-semibold text-sm text-white/90 line-clamp-1">{template.name}</h4>
                    </div>

                    <div className="flex items-center gap-1 z-20">
                        <Button variant="outline" size="sm" onClick={handleGenerateLocalImage} title="Generate Image" className="pointer-events-auto shrink-0 h-8 px-3 hover:bg-white/10 border-primary-500/30 text-xs font-semibold mr-1" disabled={isGeneratingImage}>
                            {isGeneratingImage ? <Loader2 className="w-3 h-3 mr-1.5 text-primary-400 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1.5 text-primary-300" />}
                            Generate Image
                        </Button>
                        {effectiveMediaUrl && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); setLayout(layout === 'split' ? 'stacked' : 'split'); }}
                                className="pointer-events-auto shrink-0 h-8 px-2 hover:bg-white/10 text-[10px] text-white/60 mr-2 border border-white/10"
                            >
                                <LayoutTemplate className="w-3 h-3 mr-1" />
                                {layout === 'split' ? 'Split' : 'Stacked'}
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={handleDownloadImage} title="Download Image & Text" className="pointer-events-auto shrink-0 h-8 w-8 hover:bg-white/10" disabled={downloading}>
                            {downloading ? <ImageIcon className="w-4 h-4 text-primary-400 animate-pulse" /> : <Download className="w-4 h-4 text-white/60 hover:text-white" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Text" className="pointer-events-auto shrink-0 h-8 w-8 hover:bg-white/10">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60 hover:text-white" />}
                        </Button>
                    </div>
                </div>

                <CardContent className="p-6 flex-grow overflow-auto text-sm text-white/80 space-y-4 font-sans leading-relaxed">
                    {template.blocks.map((block, idx) => {
                        if (block.kind === "headline") {
                            return <p key={idx} className="font-bold text-lg text-white mb-2 leading-tight">{injectVariables(block.text)}</p>;
                        }
                        if (block.kind === "subhead") {
                            return <p key={idx} className="font-semibold text-white/90 mt-4 mb-1">{injectVariables(block.text)}</p>;
                        }
                        if (block.kind === "bullets") {
                            return (
                                <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-white/70">
                                    {block.items.map((item, i) => (
                                        <li key={i}>{injectVariables(item)}</li>
                                    ))}
                                </ul>
                            );
                        }
                        if (block.kind === "cta") {
                            return <p key={idx} className="font-medium mt-5 uppercase tracking-wide text-xs" style={{ color: context.brandColor }}>{injectVariables(block.text)}</p>;
                        }
                        if (block.kind === "disclaimer") {
                            return <p key={idx} className="text-[10px] text-white/30 italic mt-6">{injectVariables(block.text)}</p>;
                        }
                        return <p key={idx} className="my-2 text-white/70 leading-relaxed">{injectVariables(block.text)}</p>;
                    })}

                    {(context.companySlogan || effectiveMediaUrl) && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                            {context.companySlogan && (
                                <p className="font-medium text-xs break-words" style={{ color: context.brandColor }}>{context.companySlogan}</p>
                            )}
                            {effectiveMediaUrl && (
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
                                    <img src={effectiveMediaUrl} alt="Attached Media" className="w-full h-auto object-cover max-h-48" />
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hidden layout element purely for Image Generation via html-to-image */}
            <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none">
                <div
                    ref={printRef}
                    className={`w-[1080px] h-[1080px] flex flex-col justify-center p-16 relative overflow-hidden ${template.theme === 'soft' ? 'bg-[#FAF9F6] text-stone-800 font-serif' : 'bg-zinc-950 text-white font-sans'
                        }`}
                    style={{ fontFamily: template.theme === 'soft' ? '"Playfair Display", Georgia, serif' : 'system-ui, -apple-system, sans-serif' }}
                >
                    {/* Background Aesthetic */}
                    <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full opacity-50 ${template.theme === 'soft' ? 'mix-blend-normal opacity-20' : 'mix-blend-screen'}`} style={{ backgroundColor: context.brandColor }} />
                    <div className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] blur-[100px] rounded-full opacity-30 ${template.theme === 'soft' ? 'mix-blend-normal opacity-10' : 'mix-blend-screen'}`} style={{ backgroundColor: context.brandColor }} />
                    {template.theme !== 'soft' && (
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)" />
                    )}

                    {/* Content Container */}
                    <div className={`relative z-10 flex h-full border rounded-[40px] shadow-2xl overflow-hidden ${template.theme === 'soft' ? 'bg-white/40 border-stone-200/50 backdrop-blur-xl' : 'bg-white/5 border-white/10 backdrop-blur-md'
                        } ${effectiveMediaUrl
                            ? (layout === 'split' ? 'flex-row' : 'flex-col justify-center items-center')
                            : 'flex-col p-16 justify-center'
                        }`}>

                        {/* Media Section */}
                        {effectiveMediaUrl && (
                            <div className={`${layout === 'split'
                                ? `w-[45%] h-full shrink-0 border-r relative ${template.theme === 'soft' ? 'bg-stone-100 border-stone-200/50' : 'bg-black/50 border-white/10'}`
                                : `w-full h-[45%] shrink-0 relative border-b ${template.theme === 'soft' ? 'bg-stone-100 border-stone-200/50' : 'bg-black border-white/10'}`
                                }`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={effectiveMediaUrl} alt="Post Media" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Text Content Side */}
                        <div className={`flex flex-col h-full justify-center overflow-hidden
                            ${effectiveMediaUrl ? (layout === 'split' ? 'w-[55%] p-10' : 'w-full text-center items-center p-10') : 'w-full'}
                            ${template.isVisualHeavy ? 'opacity-90' : ''}`}>

                            {template.blocks.filter(b => b.kind !== 'disclaimer').map((block, idx) => {
                                const hasMedia = !!effectiveMediaUrl;
                                // Increase sizing specifically for visualHeavy templates
                                const isHeavy = template.isVisualHeavy;

                                if (block.kind === "headline") {
                                    return <h1 key={idx} className={`${hasMedia
                                        ? (isHeavy ? 'text-4xl uppercase' : 'text-3xl')
                                        : (isHeavy ? `text-6xl uppercase ${template.theme === 'soft' ? 'text-stone-800' : 'text-primary-200'} drop-shadow-lg` : 'text-5xl')
                                        } font-extrabold ${template.theme === 'soft' ? 'text-stone-900 font-serif' : 'text-white font-sans'} mb-4 leading-[1.1] tracking-tight`}>{injectVariables(block.text)}</h1>;
                                }
                                if (block.kind === "subhead") {
                                    return <h2 key={idx} className={`${hasMedia
                                        ? (isHeavy ? (template.theme === 'soft' ? 'text-2xl text-stone-600' : 'text-2xl text-primary-300') : 'text-xl')
                                        : (isHeavy ? (template.theme === 'soft' ? 'text-4xl text-stone-700' : 'text-4xl text-primary-400') : 'text-3xl')
                                        } mt-4 mb-3 font-bold ${template.theme === 'soft' ? 'text-stone-700/90 font-serif italic' : 'text-white/90 font-sans'}`}>{injectVariables(block.text)}</h2>;
                                }
                                if (block.kind === "bullets") {
                                    return (
                                        <ul key={idx} className={`list-disc ${hasMedia
                                            ? (isHeavy ? 'pl-6 text-xl space-y-2' : 'pl-5 text-lg space-y-1')
                                            : (isHeavy ? 'pl-10 text-3xl space-y-4' : 'pl-8 text-2xl space-y-3')
                                            } my-4 ${template.theme === 'soft' ? 'text-stone-600 font-sans' : 'text-white/80 font-sans'} ${layout === 'stacked' && hasMedia ? 'text-left inline-block' : ''}`}>
                                            {block.items.map((item, i) => (
                                                <li key={i} className={isHeavy ? `drop-shadow-sm font-medium ${template.theme === 'soft' ? 'text-stone-800' : 'text-white/90'}` : ""}>{injectVariables(item)}</li>
                                            ))}
                                        </ul>
                                    );
                                }
                                if (block.kind === "cta") {
                                    return <div key={idx} className={`inline-block ${hasMedia
                                        ? (isHeavy ? 'px-6 py-3 text-xl shadow-xl ring-2 ring-primary-500/30' : 'px-5 py-2.5 text-lg')
                                        : (isHeavy ? 'px-10 py-5 text-4xl shadow-2xl ring-8 ring-primary-500/30' : 'px-8 py-4 text-3xl')
                                        } mt-6 rounded-xl font-black uppercase tracking-wider ${layout !== 'stacked' || !hasMedia ? 'self-start' : 'mx-auto'} ${template.theme === 'soft' ? 'text-white' : 'text-black'}`}
                                        style={{ backgroundColor: context.brandColor }}
                                    >
                                        {injectVariables(block.text)}
                                    </div>;
                                }
                                return <p key={idx} className={`${hasMedia
                                    ? (isHeavy ? 'text-xl font-medium' : 'text-lg')
                                    : (isHeavy ? 'text-3xl font-semibold' : 'text-2xl')
                                    } my-3 leading-relaxed ${template.theme === 'soft' ? 'text-stone-600 font-sans' : 'text-white/80 font-sans'} ${isHeavy ? `drop-shadow-sm ${template.theme === 'soft' ? 'text-stone-800' : 'text-white/90'}` : ''}`}>{injectVariables(block.text)}</p>;
                            })}

                            {context.companySlogan && (
                                <div className={`mt-auto pt-8 border-t flex shrink-0 ${template.theme === 'soft' ? 'border-stone-300' : 'border-white/20'} ${effectiveMediaUrl
                                    ? (layout === 'split' ? 'items-start flex-col' : 'items-center justify-center w-full')
                                    : 'items-center gap-8'
                                    }`}>
                                    <p className={`${effectiveMediaUrl ? 'text-2xl' : 'text-4xl pr-8'} font-bold leading-tight break-words ${layout === 'stacked' ? 'text-center' : ''}`} style={{ color: context.brandColor }}>{context.companySlogan}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Branding Footer */}
                    <div className={`absolute bottom-6 right-8 text-xl font-medium tracking-widest flex items-center gap-3 ${template.theme === 'soft' ? 'text-stone-400' : 'text-white/40'}`}>
                        <ImageIcon className="w-6 h-6" />
                        Generated via The Smart List
                    </div>
                </div>
            </div>
        </>
    );
}
