import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetIndustries = [
    "Plumbing", "General Contractor", "Carpenter", "Craftsman",
    "Appliance Repair", "Digital Products", "Fashion", "Cosmetics Reseller",
    "Affiliate Marketer", "Computers, Repair", "Audio/Visual Installer",
    "Electrician", "Accountant", "Lawyer", "BookKeeper",
    "Virtual Assistant", "Arts", "Food/Restaurant", "Photography",
    "Marketing", "Advertising", "Finance", "Fitness",
    "Wellness Coach", "Dental/Medical", "Tax Prep", "Tutor", "Lawn/Garden"
];

function generatePack(name) {
    return {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        name: name,
        icpSummary: "Targeting customers looking for reliable and professional " + name + " services.",
        painPoints: [
            "Struggling to find a trustworthy " + name,
            "Frustrated by hidden fees in " + name + " services",
            "Wasting time trying to do " + name + " tasks themselves",
            "Tired of poor communication from past " + name + " professionals"
        ],
        desiredOutcomes: [
            "A seamless, stress-free " + name + " experience",
            "Clear, upfront pricing with no surprises",
            "Saving time and getting professional results",
            "Working with an expert who actually listens"
        ],
        objections: [
            "I can probably just figure it out on YouTube",
            "It is too expensive to hire a professional " + name,
            "All " + name + " services are basically the same",
            "I do not have time to deal with this right now"
        ],
        proofPoints: [
            "Over 100+ 5-star local reviews",
            "10+ years of dedicated experience",
            "Satisfaction guaranteed or we make it right"
        ],
        offers: [
            "Free Initial Consultation / Estimate",
            "10% Off Your First Service",
            "Complimentary System Audit"
        ],
        hookAngles: [
            "The #1 mistake people make when looking for a " + name + "...",
            "Stop wasting money on DIY. Do this instead.",
            "3 questions you MUST ask your " + name + " before hiring them."
        ],
        exampleKeywords: [
            "Best " + name + " near me",
            "Affordable " + name,
            "Professional " + name + " services",
            "Hire a " + name
        ]
    };
}

const newPacks = targetIndustries.map(generatePack);
const filePath = path.join(__dirname, "../src/data/industries.ts");
let existingFile = fs.readFileSync(filePath, "utf8");

const toAppendJSON = newPacks.map(p => JSON.stringify(p, null, 4)).join(",\n");

// Replace the closing bracket
existingFile = existingFile.replace(
    /\}\s*\];\s*$/,
    "},\n" + toAppendJSON + "\n];\n"
);

fs.writeFileSync(filePath, existingFile);
console.log("Successfully appended 28 new industry packs.");
