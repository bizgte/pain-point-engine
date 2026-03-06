import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function Settings() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">ContEngine Settings & Developer Hub</h2>
                <p className="text-white/60">Manage your account, preferences, and API access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Info */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Account Information</CardTitle>
                        <CardDescription className="text-white/60">Your current plan and limits.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Email</span>
                            <span className="text-white font-medium">user@example.com</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Current Plan</span>
                            <span className="px-2 py-1 bg-white/10 text-white rounded text-xs font-bold uppercase tracking-wider">Free Tier</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Weekly Downloads</span>
                            <span className="text-white font-medium">1 / 3 Used</span>
                        </div>
                        <Button className="w-full mt-4" variant="outline">Upgrade to Pro</Button>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Preferences</CardTitle>
                        <CardDescription className="text-white/60">Global default settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Default Export Layout</span>
                            <span className="text-white font-medium">Split (50/50)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Theme</span>
                            <span className="text-white font-medium">Dark Mode Only</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Include Watermark</span>
                            <span className="text-green-400 font-medium">Enabled (Free Tier)</span>
                        </div>
                        <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white" variant="ghost">Save Preferences</Button>
                    </CardContent>
                </Card>

                {/* API References */}
                <Card className="bg-white/5 border-white/10 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Public Developer API</CardTitle>
                        <CardDescription className="text-white/60">Integrate ContEngine directly into your own SaaS or Agency CRM.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-white/5 overflow-x-auto">
                            <p className="text-primary-400 mb-2">// Endpoint</p>
                            <p className="text-white">POST /api/v1/templates</p>

                            <p className="text-primary-400 mt-4 mb-2">// Headers</p>
                            <p className="text-white">x-api-key: <span className="text-yellow-300">sk_test_12345</span></p>

                            <p className="text-primary-400 mt-4 mb-2">// Example Payload</p>
                            <pre className="text-white/80">
                                {`{
  "industryId": "realtor",
  "limit": 10
}`}
                            </pre>
                        </div>
                        <p className="text-sm text-white/50">Your API key is currently running in test mode. Upgrade to a Pro Developer account to generate live keys.</p>
                        <Button className="mt-4" variant="outline">Generate Live Key</Button>
                    </CardContent>
                </Card>

                {/* How-to Guide */}
                <Card className="bg-white/5 border-white/10 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">How to use ContEngine</CardTitle>
                        <CardDescription className="text-white/60">A quick guide to maximizing your social media presence.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-white/80 text-sm leading-relaxed">
                        <div>
                            <h4 className="font-bold text-white mb-2">1. Choose your Industry</h4>
                            <p>Start by selecting an industry from the dropdown on the Generator page. If your exact industry isn't listed, simply choose &quot;Custom&quot; and type it in—our AI will dynamically build a structured pain-point pack tailored precisely to your niche.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-2">2. Customize the Variables</h4>
                            <p>Fill in the global variables such as your City, Offer details, Brand Color, and upload a piece of media (like an image or video thumbnail). These instantly map into the psychological holes in the templates.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-2">3. Unlock & Download</h4>
                            <p>Browse the blurred gallery. Click on the templates that resonate best with your current campaign (up to 3 for free). Once unlocked, use the Download button to instantly save a branded, high-res 1080x1080 image pack, alongside a deep-dive text caption ready to paste on Instagram or Facebook.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
