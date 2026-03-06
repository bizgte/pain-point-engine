import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
export const dynamic = "force-dynamic";
import { CheckCircle2, Sparkles, ArrowRight, Zap, Settings2, LayoutTemplate } from "lucide-react";
import { Generator } from "@/components/generator/Generator";
import { Settings } from "@/components/settings/Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[100px] mix-blend-screen" />
        </div>

        <div className="container px-4 py-20 mx-auto text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium border border-white/10 rounded-full bg-white/5 text-primary-100 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span>v1.1 is now live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Convert Pain Points into <span className="text-gradient">Ready-to-Post</span> Templates.
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Choose your industry. Select your goals. Generate high-converting social content instantly. No generic fluff, just proven psychology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#generate" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base group">
                Start Generating Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
              View Example Packs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <Card className="bg-white/5 hover:bg-white/10 transition-colors border-white/10">
              <CardContent className="p-6">
                <Zap className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Industry Tuned</h3>
                <p className="text-white/60 text-sm">Pre-built packs for HVAC, Realtors, SaaS, and more. Authentic voices only.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 hover:bg-white/10 transition-colors border-white/10">
              <CardContent className="p-6">
                <CheckCircle2 className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Psychology First</h3>
                <p className="text-white/60 text-sm">Every template maps a core customer pain point to your direct solution.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 hover:bg-white/10 transition-colors border-white/10">
              <CardContent className="p-6">
                <Sparkles className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Ready to Publish</h3>
                <p className="text-white/60 text-sm">Export instantly in single post, carousel, or short video ad script formats.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main App Section */}
      <div className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md relative z-10 pt-8 pb-20" id="app">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="generator" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/5 border border-white/10 w-full max-w-sm grid grid-cols-2 p-1">
                <TabsTrigger value="generator" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white transition-all">
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Generator
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Settings & API
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="generator" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <Generator />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <Settings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
