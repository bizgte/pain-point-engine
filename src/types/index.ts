export type TemplateBlock =
    | { kind: "headline"; text: string }
    | { kind: "subhead"; text: string }
    | { kind: "bullets"; items: string[] }
    | { kind: "body"; text: string }
    | { kind: "cta"; text: string }
    | { kind: "disclaimer"; text: string };

export type TemplateType = "carousel" | "single" | "caption" | "ad";

export type TemplateDefinition = {
    id: string;
    industryId: string;
    name: string;
    type: TemplateType;
    goalTags: string[];
    toneTags: string[];
    platformTags: string[];
    variables: Array<{ key: string; label: string; required?: boolean }>;
    blocks: TemplateBlock[];
    isVisualHeavy?: boolean;
    theme?: 'default' | 'soft';
    deepDiveCaption?: string; // Optional expanded text for the .txt download
};

export type IndustryPack = {
    id: string;
    name: string;
    icpSummary: string;
    painPoints: string[];
    desiredOutcomes: string[];
    objections: string[];
    proofPoints: string[];
    offers: string[];
    hookAngles: string[];
    exampleKeywords: string[];
};

export type UserContext = {
    industryId: string;
    businessName: string;
    offer: string;
    targetCustomer: string;
    tone: string;
    goal: string;
    platform: string;
    location?: string;
    proof?: string;
    customVariables?: Record<string, string>;
    companySlogan?: string;
    mediaUrl?: string; // Always a dataURL to prevent html-to-image cors errors
    brandColor?: string;
    customIndustryName?: string;
};
