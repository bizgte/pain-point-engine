import { TemplateDefinition } from "@/types";

export const templates: TemplateDefinition[] = [
    // --- PAIN POINT ENGINE DEMO TEMPLATES (3 Showcase) ---
    {
        id: "pain-point-generic-ai",
        industryId: "pain_point_engine",
        name: "The 'Generic AI' Wake-Up Call",
        type: "carousel",
        goalTags: ["awareness", "authority"],
        toneTags: ["bold", "professional"],
        platformTags: ["linkedin", "instagram"],
        variables: [
            { key: "industry_name", label: "Your Target Industry (e.g. Real Estate)", required: true }
        ],
        blocks: [
            { kind: "headline", text: "Is your AI copy making you sound exactly like your competitors?" },
            { kind: "body", text: "If you ask ChatGPT to 'Write a post for my {{industry_name}} business', it spits out the exact same 3 boring paragraphs for everyone." },
            { kind: "subhead", text: "Your prospects can smell generic AI from a mile away. It tells them: 'I didn't care enough to write this, so why should you care enough to read it?'" },
            {
                kind: "bullets", items: [
                    "They don't want 'value'.",
                    "They want to feel UNDERSTOOD.",
                    "If you can't articulate their pain better than they can, they won't buy."
                ]
            },
            { kind: "cta", text: "Stop publishing robot jargon. Tap the link in our bio to try our Pain Point Engine and generate copy that actually converts." }
        ],
        deepDiveCaption: "Most business owners think their problem is 'I don't post enough'. No, your problem is that when you DO post, you sound like a textbook.\n\nGeneric AI tools are trained to be helpful and safe, which means they write copy that is perfectly mediocre. To sell high-ticket services, you need copy that rips the band-aid off your client's deepest, most urgent pain point.\n\nOur engine was built differently. It doesn't just write text; it reverse-engineers the psychology of your ideal buyer and builds frameworks that force them to pay attention. Want to see the difference? Click the link in my bio to generate 10 free templates for your specific niche."
    },
    {
        id: "pain-point-time-waster",
        industryId: "pain_point_engine",
        name: "The Blank Page Syndrome",
        type: "single",
        goalTags: ["leads"],
        toneTags: ["friendly"],
        platformTags: ["facebook", "instagram"],
        variables: [
            { key: "offer", label: "Current Lead Magnet or Trial", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Staring at the blinking cursor for 45 minutes again?" },
            { kind: "body", text: "Content creation wasn't supposed to be a part-time job. You started your business to serve clients, not to agonize over whether to use an emoji in a LinkedIn hook." },
            {
                kind: "bullets", items: [
                    "Stop guessing what hooks work.",
                    "Stop staring at blank pages.",
                    "Start generating proven frameworks in 3 seconds."
                ]
            },
            { kind: "cta", text: "Get 10 hours of your week back. Grab our {{offer}} and build your entire content calendar today." }
        ]
    },
    {
        id: "pain-point-client-dms",
        industryId: "pain_point_engine",
        name: "The Inbound Lead Shift",
        type: "caption",
        goalTags: ["authority"],
        toneTags: ["professional"],
        platformTags: ["linkedin", "twitter"],
        variables: [
            { key: "result", label: "Specific Result (e.g. 5 inbound calls this week)", required: true },
        ],
        blocks: [
            { kind: "headline", text: "The moment you stop 'educating' and start 'agitating', everything changes." },
            { kind: "body", text: "Educational content gets likes. Agitating the pain point gets sales. When a prospect reads your post and thinks 'Wow, are they looking in my windows? They know exactly what I am struggling with.'... that's when they DM you." },
            { kind: "subhead", text: "That exact shift resulted in {{result}} for our agency." },
            { kind: "cta", text: "Learn the 3-part psychological hook framework we use. Link in the comments." }
        ]
    },
    // --- HVAC TEMPLATES (10) ---
    {
        id: "hvac-mythbuster-freon",
        industryId: "hvac",
        name: "The 'Stop Wasting Money' Myth Buster",
        type: "carousel",
        goalTags: ["awareness", "authority"],
        toneTags: ["professional", "bold"],
        platformTags: ["instagram", "linkedin"],
        variables: [
            { key: "city", label: "Your City/Service Area", required: true },
            { key: "offer", label: "Current Offer (e.g. $49 Tune-Up)", required: true }
        ],
        blocks: [
            { kind: "headline", text: "Stop paying for 'Freon Recharges'. Here is the truth." },
            { kind: "body", text: "If an HVAC company tells you that your AC just needs a 'little freon top-off' every summer, they are lying to you." },
            {
                kind: "bullets", items: [
                    "Air conditioners are closed systems.",
                    "They don't 'use up' or 'burn' freon.",
                    "If you are low on freon, you have a leak."
                ]
            },
            { kind: "subhead", text: "Paying for a recharge without fixing the leak is literally blowing money into the air." },
            { kind: "cta", text: "Stop the cycle. Get a permanent fix. Tap the link in our bio for a {{offer}} in {{city}}." },
            { kind: "disclaimer", text: "*Offer valid for new customers only. Subject to availability." }
        ]
    },
    {
        id: "hvac-emergency-speed",
        industryId: "hvac",
        name: "Emergency Breakdown Hero",
        type: "single",
        goalTags: ["leads"],
        toneTags: ["professional", "friendly"],
        platformTags: ["facebook", "instagram"],
        variables: [
            { key: "city", label: "Your City/Service Area", required: true },
        ],
        blocks: [
            { kind: "headline", text: "AC stopped working in the middle of this {{city}} heat?" },
            { kind: "body", text: "You don't have to wait 3 days for 'the next available tech' while your house turns into a sauna. We keep emergency trucks fully stocked and ready in your neighborhood." },
            {
                kind: "bullets", items: [
                    "Same-day emergency response.",
                    "No hidden 'after hours' fees.",
                    "Upfront pricing before we start any work."
                ]
            },
            { kind: "cta", text: "Don't suffer through the night. Call us right now, we are answering the phones." }
        ]
    },
    {
        id: "hvac-high-bills",
        industryId: "hvac",
        name: "The 'High Energy Bill' Audit",
        type: "caption",
        goalTags: ["leads", "awareness"],
        toneTags: ["professional"],
        platformTags: ["instagram", "facebook"],
        variables: [
            { key: "city", label: "Your City/Service Area", required: true },
            { key: "offer", label: "Current Offer (e.g. $49 Tune-Up)", required: true }
        ],
        blocks: [
            { kind: "headline", text: "Did your electric bill just double?" },
            { kind: "body", text: "Before you blame the power company, check your AC unit. Most massive spikes in summer electric bills are caused by a failing compressor or severe duct leaks." },
            { kind: "subhead", text: "An AC struggling to cool uses 3x more electricity." },
            { kind: "cta", text: "Stop paying the utility company for air you aren't feeling. Book our {{offer}} in {{city}} and let's find the leak." }
        ]
    },
    {
        id: "hvac-filter-reminder",
        industryId: "hvac",
        name: "The 'Change Your Filter' PSA",
        type: "single",
        goalTags: ["awareness", "authority"],
        toneTags: ["friendly"],
        platformTags: ["instagram", "facebook"],
        variables: [
            { key: "city", label: "Your City/Service Area", required: true },
        ],
        blocks: [
            { kind: "headline", text: "A $15 piece of cardboard can destroy your $5,000 AC unit." },
            { kind: "body", text: "When was the last time you changed your air filter? A clogged filter forces your AC to work twice as hard, leading to frozen coils and blown motors." },
            {
                kind: "bullets", items: [
                    "Standard filters: Change every 30 days.",
                    "Pleated filters: Change every 90 days.",
                    "Have pets? Change them more often."
                ]
            },
            { kind: "cta", text: "This is a friendly reminder to go change your filter right now! Save this post so you don't forget next month." }
        ]
    },
    {
        id: "hvac-shady-techs",
        industryId: "hvac",
        name: "Trust & Upfront Pricing",
        type: "carousel",
        goalTags: ["authority"],
        toneTags: ["bold", "professional"],
        platformTags: ["linkedin", "instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Tired of AC techs who walk in and immediately say 'You need a whole new system'?" },
            { kind: "body", text: "We hear horror stories in {{city}} every day about pushy salespeople disguised as technicians." },
            { kind: "subhead", text: "Our promise to you:" },
            {
                kind: "bullets", items: [
                    "We fix it if it makes financial sense to fix.",
                    "We show you exactly what is broken.",
                    "We give you the price BEFORE we do the work. No surprises."
                ]
            },
            { kind: "cta", text: "Looking for an honest second opinion? Send us a DM." }
        ]
    },
    {
        id: "hvac-new-system-financing",
        industryId: "hvac",
        name: "New System Financing",
        type: "ad",
        goalTags: ["leads"],
        toneTags: ["professional"],
        platformTags: ["facebook"],
        variables: [
            { key: "offer", label: "Financing Terms (e.g. $0 Down)", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Is your AC over 12 years old?" },
            { kind: "body", text: "Stop dumping money into costly repairs on a system that's on its last legs. A new high-efficiency system cools faster and slashes your electric bill." },
            { kind: "subhead", text: "And no, you don't need $10k in cash today." },
            { kind: "cta", text: "We are offering {{offer}} on new system installs this month. Click here to get a free, no-pressure estimate." }
        ]
    },
    {
        id: "hvac-noise-warning",
        industryId: "hvac",
        name: "The 'Weird Noises' Warning",
        type: "single",
        goalTags: ["awareness"],
        toneTags: ["friendly"],
        platformTags: ["instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
            { key: "offer", label: "Current Offer", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Is your AC squealing, banging, or buzzing?" },
            { kind: "body", text: "Air conditioners are designed to run quietly. If you hear loud, aggressive noises, a breakdown is imminent." },
            {
                kind: "bullets", items: [
                    "Squealing = failing belt or motor bearing.",
                    "Banging = loose part inside the compressor.",
                    "Buzzing = electrical failure or loose wiring."
                ]
            },
            { kind: "cta", text: "Catch it before it fails. Grab our {{offer}} to have one of our {{city}} techs inspect it today." }
        ]
    },
    {
        id: "hvac-maintenance-roi",
        industryId: "hvac",
        name: "The Maintenance ROI",
        type: "caption",
        goalTags: ["authority"],
        toneTags: ["professional"],
        platformTags: ["linkedin"],
        variables: [
            { key: "offer", label: "Maintenance Plan Name", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Why do commercial buildings require HVAC maintenance, but homeowners skip it?" },
            { kind: "body", text: "Businesses know that preventative maintenance prevents $10,000 catastrophic failures. You should treat your home the same way." },
            { kind: "cta", text: "Join our {{offer}} today and get twice-a-year tune-ups, priority service, and zero breakdown anxiety." }
        ]
    },
    {
        id: "hvac-indoor-air-quality",
        industryId: "hvac",
        name: "The Sneezing Epidemic (IAQ)",
        type: "carousel",
        goalTags: ["leads", "awareness"],
        toneTags: ["friendly", "professional"],
        platformTags: ["instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Waking up sneezing in {{city}}? It might not be allergies." },
            { kind: "body", text: "Your AC's ductwork can hold pounds of dust, pet dander, and mold spores that circulate through your home 24/7." },
            { kind: "subhead", text: "The EPA warns indoor air can be 5x more polluted than outdoor air." },
            { kind: "cta", text: "Breathe easier today. DM us 'CLEAN AIR' to ask about our Whole-Home Purifier installations." }
        ]
    },
    {
        id: "hvac-second-opinion",
        industryId: "hvac",
        name: "The Free Second Opinion",
        type: "ad",
        goalTags: ["leads"],
        toneTags: ["bold"],
        platformTags: ["facebook", "instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Did another company tell you your AC is dead?" },
            { kind: "body", text: "Before you sign a $10,000 contract, let us take a look. 30% of the 'dead' systems we inspect in {{city}} just need a minor repair." },
            {
                kind: "bullets", items: [
                    "No pressure.",
                    "No sales tactics.",
                    "Just honest advice from certified techs."
                ]
            },
            { kind: "cta", text: "Click here to book a FREE Second Opinion visit. If it really is dead, we'll tell you." }
        ]
    },

    // --- REALTOR TEMPLATES (10) ---
    {
        id: "realtor-market-shift",
        industryId: "realtor",
        name: "The 'Market Shift' Reality Check",
        type: "single",
        goalTags: ["leads", "awareness"],
        toneTags: ["friendly", "professional"],
        platformTags: ["facebook", "instagram"],
        variables: [
            { key: "city", label: "Your City/Market Area", required: true },
            { key: "timeframe", label: "Avg days on market (e.g. 14 Days)", required: true }
        ],
        blocks: [
            { kind: "headline", text: "Thinking of selling in {{city}}? The rules have changed." },
            { kind: "body", text: "You can't just stick a sign in the yard and expect 10 offers over asking anymore. Buyers are being highly selective. But houses ARE still selling—if positioned right." },
            {
                kind: "bullets", items: [
                    "Price it according to CURRENT data, not 6 months ago.",
                    "Professional staging and photography are non-negotiable.",
                    "Address minor repairs BEFORE listing to remove buyer objections."
                ]
            },
            { kind: "subhead", text: "Our average listing is currently selling in just {{timeframe}}." },
            { kind: "cta", text: "Want to know exactly what your home could sell for today? DM me 'VALUATION' for a free custom market report." }
        ]
    },
    {
        id: "realtor-rate-myth",
        industryId: "realtor",
        name: "Waiting for Rates to Drop?",
        type: "carousel",
        goalTags: ["authority"],
        toneTags: ["bold", "professional"],
        platformTags: ["instagram", "linkedin"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Why 'waiting for interest rates to drop' could cost you thousands." },
            { kind: "body", text: "Everyone in {{city}} says they are waiting to buy until rates hit 4% again. Here is the math they are missing:" },
            {
                kind: "bullets", items: [
                    "If rates drop significantly, millions of buyers re-enter the market.",
                    "More competition triggers fierce bidding wars.",
                    "Home prices spike, wiping out your 'interest rate savings'."
                ]
            },
            { kind: "subhead", text: "Marry the house, date the rate." },
            { kind: "cta", text: "DM me to see how much negotiating power you actually have in today's market right now." }
        ]
    },
    {
        id: "realtor-fsbo-warning",
        industryId: "realtor",
        name: "The FSBO Trap",
        type: "caption",
        goalTags: ["authority", "awareness"],
        toneTags: ["professional"],
        platformTags: ["facebook", "linkedin"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Thinking of selling For Sale By Owner to save 3%?" },
            { kind: "body", text: "Statistically, FSBO homes sell for 16% LESS than agent-listed homes. Why? Because you aren't just paying for a sign in the yard." },
            {
                kind: "bullets", items: [
                    "You pay for negotiating buffer.",
                    "You pay for legal liability protection.",
                    "You pay for aggressive, targeted marketing to qualified buyers, not just Zillow window-shoppers."
                ]
            },
            { kind: "cta", text: "Let's maximize your equity. Send me a message and let's talk about listing your {{city}} home properly." }
        ]
    },
    {
        id: "realtor-first-time-buyer",
        industryId: "realtor",
        name: "First-Time Buyer Roadmap",
        type: "single",
        goalTags: ["leads"],
        toneTags: ["friendly"],
        platformTags: ["instagram", "tiktok"],
        variables: [
            { key: "city", label: "Your City", required: true },
            { key: "offer", label: "Ebook or Guide name", required: true }
        ],
        blocks: [
            { kind: "headline", text: "Overwhelmed by the thought of buying your first house?" },
            { kind: "body", text: "You don't need to have a perfect 800 credit score or 20% down to buy a home in {{city}}. But you do need a plan." },
            {
                kind: "bullets", items: [
                    "Step 1: Get pre-approved (know your real budget).",
                    "Step 2: Map out your uncompromisable 'must-haves'.",
                    "Step 3: Hunt with an agent who protects you."
                ]
            },
            { kind: "cta", text: "I put together a complete First-Time Buyer roadmap for this area. Comment 'ROADMAP' and I'll send you my {{offer}} for free." }
        ]
    },
    {
        id: "realtor-staging-roi",
        industryId: "realtor",
        name: "The ROI of Staging",
        type: "carousel",
        goalTags: ["authority"],
        toneTags: ["professional"],
        platformTags: ["instagram", "facebook"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Staging isn't an expense. It's an investment." },
            { kind: "body", text: "A vacant house or a cluttered home makes buyers focus on the negative. They notice scuffs on the wall instead of the beautiful natural light." },
            { kind: "subhead", text: "Professionally staged homes spend 73% less time on the market." },
            {
                kind: "bullets", items: [
                    "It defines awkward spaces.",
                    "It creates an emotional connection.",
                    "It looks drastically better in photos."
                ]
            },
            { kind: "cta", text: "We include staging consultations with every {{city}} listing. Send a DM to learn more about our process." }
        ]
    },
    {
        id: "realtor-off-market",
        industryId: "realtor",
        name: "Off-Market Access",
        type: "ad",
        goalTags: ["leads"],
        toneTags: ["bold"],
        platformTags: ["facebook", "instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Tired of losing bidding wars in {{city}}?" },
            { kind: "body", text: "If you are only looking at Zillow, you are seeing houses everyone else is already fighting over." },
            { kind: "subhead", text: "You need off-market access." },
            { kind: "cta", text: "Click here to join my private VIP Buyer List and get alerted to properties *before* they hit the public MLS." }
        ]
    },
    {
        id: "realtor-inspection-fears",
        industryId: "realtor",
        name: "Inspection Anxiety",
        type: "caption",
        goalTags: ["awareness"],
        toneTags: ["friendly"],
        platformTags: ["instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Why getting a bad inspection report isn't the end of the world." },
            { kind: "body", text: "First-time buyers often panic when the inspector hands them a 40-page report. Breathe." },
            {
                kind: "bullets", items: [
                    "Inspectors are paid to find EVERYTHING.",
                    "Most items are $50 DIY fixes.",
                    "Major items mean we go back to the seller to negotiate."
                ]
            },
            { kind: "cta", text: "That's why you hire a tough agent. We don't just find houses in {{city}}; we negotiate the hurdles. DM me to start your stress-free search." }
        ]
    },
    {
        id: "realtor-downsizing",
        industryId: "realtor",
        name: "The Empty Nester Downsize",
        type: "single",
        goalTags: ["leads"],
        toneTags: ["friendly", "professional"],
        platformTags: ["facebook"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Kids moved out? Stop cleaning rooms you don't use." },
            { kind: "body", text: "Downsizing isn't about losing space; it's about gaining freedom. Imagine lower property taxes, lower utility bills, and zero weekend yard work." },
            { kind: "subhead", text: "The equity in your current family home could pay for a stunning, low-maintenance condo in cash." },
            { kind: "cta", text: "Let's explore your options in {{city}}. Call me today for a casual, no-pressure chat about your next chapter." }
        ]
    },
    {
        id: "realtor-pricing-strategy",
        industryId: "realtor",
        name: "The Dangers of Overpricing",
        type: "carousel",
        goalTags: ["authority"],
        toneTags: ["bold"],
        platformTags: ["instagram", "linkedin"],
        variables: [
            { key: "city", label: "Your City", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Let's just price it high and see if we get bites! (Don't do this)" },
            { kind: "body", text: "Overpricing your {{city}} home on day 1 is the fastest way to lose money." },
            {
                kind: "bullets", items: [
                    "It sits on the market past its 'freshness date'.",
                    "Buyers start wondering 'What's wrong with it?'",
                    "You eventually drop the price, signaling desperation.",
                    "You get lowball offers."
                ]
            },
            { kind: "cta", text: "Price it accurately. Staging it perfectly. Create a frenzy. That's how we get top dollar. DM to learn my pricing strategy." }
        ]
    },
    {
        id: "realtor-relocation",
        industryId: "realtor",
        name: "Moving to Town?",
        type: "ad",
        goalTags: ["leads"],
        toneTags: ["friendly"],
        platformTags: ["facebook", "instagram"],
        variables: [
            { key: "city", label: "Your City", required: true },
            { key: "offer", label: "Relocation Guide Name", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Relocating to {{city}} this year?" },
            { kind: "body", text: "Trying to buy a house in a city you don't know is incredibly stressful. You need an agent who knows the commute times, the school districts, and the neighborhood vibes perfectly." },
            { kind: "cta", text: "Before you start searching Zillow blindly, grab my free {{offer}}." }
        ]
    },
    // --- AI AUTOMATION TEMPLATES (2 Example/Showcase) ---
    {
        id: "ai-auto-admin",
        industryId: "ai_automation",
        name: "Replace Your Admin Diagram",
        type: "carousel",
        isVisualHeavy: true,
        goalTags: ["authority"],
        toneTags: ["professional", "bold"],
        platformTags: ["linkedin", "twitter"],
        variables: [
            { key: "hours_saved", label: "Hours Saved per Week", required: true },
        ],
        blocks: [
            { kind: "headline", text: "The Workflow That Replaced A Full-Time Admin" },
            { kind: "subhead", text: "Zero code. 100% automated." },
            {
                kind: "bullets", items: [
                    "Lead triggers an email -> AI reads the intent.",
                    "AI qualifies lead via SMS instantly.",
                    "Qualified leads get calendar links."
                ]
            },
            { kind: "cta", text: "Are you still doing this manually? DM 'SYSTEMS' to save {{hours_saved}} a week." }
        ],
        deepDiveCaption: "Most business owners think they need to hire another admin to handle their growing lead volume. But what happens when that admin calls out sick? Or forgets to log something in the CRM? Yesterday, I mapped out a simple 3-step AI workflow using Make and ChatGPT for a client. \n\n1. A new lead comes in via website form.\n2. The AI instantly reads the form, categorizes their need, and sends a highly personalized SMS within 5 seconds.\n3. If they respond positively, the AI books them directly onto the calendar.\n\nThis single automation is saving them {{hours_saved}} per week and zero leads are falling through the cracks. The best part? It costs less than a fraction of an employee's salary to run. \n\nWant to see if this workflow fits your business? DM me 'SYSTEMS' and let's map it out."
    },
    {
        id: "ai-auto-sleep",
        industryId: "ai_automation",
        name: "Your Competitors Aren't Sleeping",
        type: "single",
        isVisualHeavy: true,
        goalTags: ["awareness"],
        toneTags: ["bold"],
        platformTags: ["instagram", "linkedin"],
        variables: [
            { key: "offer", label: "Audit/Consult Name", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Stop Losing Deals at 2 AM." },
            { kind: "subhead", text: "Your custom AI Sales Agent never sleeps, never takes a day off, and never forgets to follow up." },
            { kind: "cta", text: "Future-proof your business today. Click for a free {{offer}}." }
        ],
        deepDiveCaption: "Did you know that 78% of customers buy from the company that responds to them FIRST? If someone submits an inquiry to your business at 9 PM on a Friday, and you wait until Monday morning to reply... they've already bought from your competitor.\n\nHaving an AI-powered conversational agent on your site isn't just a 'cool tech gadget' anymore. It's becoming the baseline standard for customer service. Your customized AI can answer specific FAQs, quote prices, and calendar appointments at all hours of the day, speaking in the exact tone of your brand.\n\nStop leaving money on the table. Book your free {{offer}} via the link in my bio and let's get your robot hired."
    },

    // --- KDP PUBLISHING TEMPLATES (2 Example/Showcase) ---
    {
        id: "kdp-niche-warning",
        industryId: "kdp_books",
        name: "3 Dead Niches",
        type: "carousel",
        isVisualHeavy: true,
        goalTags: ["authority", "awareness"],
        toneTags: ["friendly"],
        platformTags: ["instagram", "tiktok"],
        variables: [
            { key: "niche", label: "A trending/profitable niche (e.g. Shadow Work)", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Stop publishing in these 3 dead Amazon KDP niches." },
            {
                kind: "bullets", items: [
                    "Blank lined notebooks (Saturated)",
                    "Basic gratitude journals (Too competitive)",
                    "Generic coloring books (Low quality)"
                ]
            },
            { kind: "subhead", text: "The money is in sub-niches. Like {{niche}}." },
            { kind: "cta", text: "Want the exact prompt I use to find hidden goldmines? Comment 'RESEARCH'." }
        ],
        deepDiveCaption: "If you published a blank lined notebook with a flower on the cover in 2018, you probably made money. If you do it today, your book will be buried behind 500,000 identical items.\n\nThe Amazon KDP game has changed. The algorithm rewards highly targeted sub-niches that solve specific problems for specific people. Instead of a 'Gratitude Journal', you need to be publishing 'A 90-Day Gratitude Journal for First-Time Mothers of Twins'. See the difference?\n\nMy favorite undiscovered niche right now is {{niche}}. If you want to see exactly how I find these low-competition keywords before anyone else does, comment 'RESEARCH' below and I'll send you my private workflow."
    },
    {
        id: "kdp-cover-formula",
        industryId: "kdp_books",
        name: "The Cover Click Formula",
        type: "single",
        isVisualHeavy: true,
        goalTags: ["leads"],
        toneTags: ["professional"],
        platformTags: ["instagram", "facebook"],
        variables: [
            { key: "offer", label: "Cover Template Pack", required: true },
        ],
        blocks: [
            { kind: "headline", text: "Your interior is perfect. Why isn't it selling?" },
            { kind: "subhead", text: "Because nobody is clicking your cover." },
            {
                kind: "bullets", items: [
                    "Use high-contrast typography.",
                    "Ensure the title is readable at a thumbnail size.",
                    "Match the visual expectations of the Top 10 sellers."
                ]
            },
            { kind: "cta", text: "Skip the design headache. Download my {{offer}} at the link in bio." }
        ],
        deepDiveCaption: "You can write the greatest book in the world, or compile the most helpful planner pages... but if your cover looks like it was made in MS Paint in 5 minutes, the Amazon shopper will keep scrolling.\n\nAmazon is a visual search engine. Your cover is your only advertisement. Before you spend money on Amazon Ads, you have to ensure your cover actually converts clicks into sales.\n\nThe 3 rules I live by:\n1. High contrast. Dark text on light backgrounds or vice versa.\n2. Thumbnail test. Zoom out until the cover is tiny. Can you still read the main title?\n3. Niche matching. If every bestselling Sci-Fi book has a dark blue space cover, don't make yours bright yellow. Give the buyer what they expect.\n\nIf you want a head start, I'm giving away my {{offer}}. Hit the link in my bio to grab it!"
    }
];
