# ContEngine User Guide

Welcome to ContEngine! This guide explains how to use the platform to generate highly-converting, psychologically-driven social media templates, both manually through the web interface and automatically via our developer API.

---

## 1. Manual Usage (Web Interface)

The web application at [contengine.app](https://contengine.app/) is designed for instant, visual template generation and customization.

### Step 1: Select Your Industry
1. Go to the **Generator** tab.
2. In the "Select Your Industry" dropdown, choose a curated industry (e.g., HVAC, Real Estate, SaaS).
3. **Custom Industries:** If your niche isn't listed, select "Custom (Type your own)". A new input field will appear. Type your exact industry (e.g., "Mobile Dog Grooming for Anxious Pets").
4. Click the **Generate [Industry] Pain Points** button at the bottom of the screen. The AI will instantly write 10 new, optimized templates for your specific use case.

### Step 2: Set Global Variables
Under the "Global Brand Assets" section, fill in details that apply to *all* your posts:
*   **Company Slogan / Link:** Ensure all posts have the correct call to action.
*   **Brand Media:** Upload an image or video thumbnail to see how it looks inside the generated layouts.
*   **Primary Brand Color:** Click the color picker to instantly re-theme all templates to match your brand's colors.

### Step 3: Set Specific Variables
Depending on the templates generated, the AI might leave placeholders like `{{city}}` or `{{offer}}`. Fill these out in the "Specific Variables" section on the left sidebar to instantly sync the text across all your templates.

### Step 4: Export and Download
1. Browse the generated templates on the right side of the screen. 
2. Because you are on the Free Tier preview, you will see 3 generated templates. 
3. Click **Download** on any template to export it as a high-resolution PNG image, ready to post on Instagram, LinkedIn, or Facebook.
4. Copy the **Deep Dive Caption** for your textual post content.

---

## 2. API Usage (n8n, Make, Zapier, Custom Code)

If you are building an automated content engine, you can bypass the front-end limitations and generate infinite templates using the Pro Developer API.

### `POST /api/n8n/generate`
This endpoint connects directly to Gemini 2.5 Flash and returns a JSON array of 10 fully formatted, psychology-first templates tailored to any industry string you provide.

#### Authentication
You must authenticate using your master API key. 
Pass the key using the `x-api-key` header in your HTTP Request.

#### Request Data
Content-Type must be `application/json`.
```json
{
  "industryName": "The specific industry, niche, or persona you want to target"
}
```

#### Example n8n Setup (HTTP Request Node)
*   **Method:** `POST`
*   **URL:** `https://contengine.app/api/n8n/generate`
*   **Authentication:** None (handled via headers)
*   **Headers:**
    *   Name: `x-api-key`
    *   Value: `sk_test_12345` *(or your custom secure key)*
*   **Send Body:** Yes
*   **Body Content Type:** JSON
*   **Specify Body:**
    ```json
    {
      "industryName": "AI Automation Agency selling B2B chatbots"
    }
    ```

#### Example Response Output
The API will return a `success` boolean, the `industry` queried, and an array of 10 `templates`.
```json
{
  "success": true,
  "industry": "AI Automation Agency selling B2B chatbots",
  "templates": [
    {
      "id": "custom-lead-leakage",
      "industryId": "custom",
      "name": "The 2AM Lead Leakage",
      "type": "single",
      "theme": "default",
      "isVisualHeavy": false,
      "goalTags": ["leads", "awareness"],
      "toneTags": ["professional", "bold"],
      "platformTags": ["linkedin", "twitter"],
      "variables": [
        {
          "key": "website_url",
          "label": "Your Website URL",
          "required": true
        }
      ],
      "blocks": [
        {
          "kind": "headline",
          "text": "Your website is active 24/7. Your sales team isn't."
        },
        {
          "kind": "body",
          "text": "How many high-ticket leads are bouncing from your pricing page at 11 PM because they couldn't get a simple question answered?"
        },
        {
          "kind": "cta",
          "text": "Stop the leakage. DM us to install a trained AI SDR on {{website_url}} in 24 hours."
        }
      ],
      "deepDiveCaption": "A long-form psychological breakdown of the cost of missed leads..."
    }
    // ... 9 more templates
  ]
}
```

### `POST /api/v1/templates`
Use this endpoint to retrieve static, manually curated templates from the internal database without invoking the AI generation.
**(Also requires `x-api-key: sk_test_12345`)**

```json
{
  "industryId": "realtor",
  "limit": 5
}
```
*Note: Returns a `count` and an array of `data`.*
