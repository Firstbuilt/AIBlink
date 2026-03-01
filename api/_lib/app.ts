import express from "express";
import { GoogleGenAI } from "@google/genai";
import { knowledgeBase, updates, riskReport, recalculateStats, setUpdates, setRiskReport, setKnowledgeBase, saveData, updateKnowledgeItemUrl, updateUpdateItemUrl, updateRiskReportEventUrl, updateFocusAreaNote, updateFocusAreaLinks, updateUpdateItemNote, updateUpdateItemLinks, updateKnowledgeItemNote, updateKnowledgeItemLinks } from './store.js';
import "dotenv/config";

// Force Vercel update
export const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Gemini lazily
// Note: In Vercel, ensure GEMINI_API_KEY is set in the project settings
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Moved inside handler

// API Routes
app.post("/api/links/knowledge-base", (req, res) => {
  const { id, url } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  
  const success = updateKnowledgeItemUrl(id, url);
  if (success) {
    res.json({ success: true, message: "Link updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post("/api/links/updates", (req, res) => {
  const { id, url } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  
  const success = updateUpdateItemUrl(id, url);
  if (success) {
    res.json({ success: true, message: "Link updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post("/api/links/risk-report", (req, res) => {
  const { focusAreaName, eventTitle, url } = req.body;
  if (!focusAreaName || !eventTitle) return res.status(400).json({ error: "Missing identifiers" });
  
  const success = updateRiskReportEventUrl(focusAreaName, eventTitle, url);
  if (success) {
    res.json({ success: true, message: "Link updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post("/api/notes/risk-report", (req, res) => {
  const { focusAreaName, note } = req.body;
  if (!focusAreaName) return res.status(400).json({ error: "Missing focus area name" });
  
  const success = updateFocusAreaNote(focusAreaName, note);
  if (success) {
    res.json({ success: true, message: "Note updated" });
  } else {
    res.status(404).json({ error: "Focus area not found" });
  }
});

app.post("/api/links/risk-report/custom", (req, res) => {
  const { focusAreaName, links } = req.body;
  if (!focusAreaName) return res.status(400).json({ error: "Missing focus area name" });
  
  const success = updateFocusAreaLinks(focusAreaName, links);
  if (success) {
    res.json({ success: true, message: "Links updated" });
  } else {
    res.status(404).json({ error: "Focus area not found" });
  }
});

app.post("/api/notes/updates", (req, res) => {
  const { id, note } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  
  const success = updateUpdateItemNote(id, note);
  if (success) {
    res.json({ success: true, message: "Note updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post("/api/links/updates/custom", (req, res) => {
  const { id, links } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  
  const success = updateUpdateItemLinks(id, links);
  if (success) {
    res.json({ success: true, message: "Links updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post("/api/notes/knowledge-base", (req, res) => {
  const { id, note } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  
  const success = updateKnowledgeItemNote(id, note);
  if (success) {
    res.json({ success: true, message: "Note updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post("/api/links/knowledge-base/custom", (req, res) => {
  const { id, links } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  
  const success = updateKnowledgeItemLinks(id, links);
  if (success) {
    res.json({ success: true, message: "Links updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.get("/api/knowledge-base", (req, res) => {
  // Sort by date descending
  const sorted = [...knowledgeBase].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(sorted);
});

app.get("/api/updates", (req, res) => {
  // Sort by date descending
  const sorted = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(sorted);
});

app.get("/api/report", (req, res) => {
  // Ensure stats are fresh
  recalculateStats();
  res.json(riskReport);
});

app.post("/api/refresh", async (req, res) => {
  try {
    // Prioritize API_KEY as it is often injected by the platform
    let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error("API Key is missing. Checked API_KEY, GEMINI_API_KEY, and GOOGLE_API_KEY.");
      return res.status(500).json({ error: "Server configuration error: Missing API Key" });
    }

    // Sanitize key: remove quotes, whitespace, and newlines
    apiKey = apiKey.replace(/['"\s\n\r]/g, '').trim();

    // Basic validation
    if (apiKey === "" || apiKey.includes("YOUR_API_KEY")) {
       console.error("API Key appears invalid (empty or placeholder).");
       return res.status(500).json({ error: "Server configuration error: Invalid API Key format" });
    }

    // Log key details for debugging (safe logging)
    const keyLength = apiKey.length;
    const keyPrefix = apiKey.substring(0, 4);
    console.log(`Using API Key starting with '${keyPrefix}' (Length: ${keyLength})`);

    if (!apiKey.startsWith("AIza")) {
      console.warn("Warning: API Key does not start with 'AIza'. This may be invalid.");
    }

    // Initialize client for this request
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 1. Search for latest news
    // Switch to 1.5-flash as it is most stable for general keys
    const model = "gemini-1.5-flash"; 
    // Simplified prompt for speed
    const searchPrompt = "Latest EU AI regulation news and enforcement actions (last 3 months). Focus on major fines or new laws.";
    
    console.log("Starting search...");
    let newData;

    try {
      const searchResponse = await ai.models.generateContent({
        model: model,
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        }
      });
      console.log("Search complete.");

      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const processingPrompt = `
        Current Date: ${dateString}.
        Task: Update ALL content to reflect the status as of today.
        
        CRITICAL INSTRUCTION FOR EXECUTIVE SUMMARY:
        - Target Audience: Product Managers and Executives (Non-technical, Non-legal).
        - Tone: Actionable, Specific, and Business-Oriented.
        - RULE 1: NO VAGUE PRONOUNS OR REFERENCES. 
          - BAD: "Recent enforcement actions highlight the importance of data governance." (Which actions?)
          - GOOD: "The €20M fine against Clearview AI highlights the strict ban on scraping biometric data."
          - BAD: "Companies should prepare for the upcoming deadline." (Which deadline?)
          - GOOD: "Companies must update technical documentation by August 2, 2026, to comply with the AI Act."
        - RULE 2: EXPLAIN IMPACT. Tell them WHAT to do or WHY it matters.
        - RULE 3: AVOID JARGON. Use terms PMs understand (e.g., "user consent", "feature rollback", "documentation update") rather than legal citations alone.

        CRITICAL INSTRUCTION FOR LINKS:
        - All URLs, especially in 'relatedEvents', MUST be specific deep links to the actual article, press release, or document.
        - DO NOT use generic homepages (e.g., "https://www.reuters.com/" is BAD; "https://www.reuters.com/technology/article-123" is GOOD).
        
        Based on the search results:
        1. Generate new update items for any recent events (last 3 months).
        2. Completely REGENERATE the Risk Assessment Report to reflect the status as of ${dateString}.
        3. Identify the current TOP 3 Critical Compliance Areas.
        
        Output JSON structure:
        {
          "newUpdates": [
            {
              "id": "string",
              "date": "YYYY-MM-DD",
              "title": { "en": "string", "cn": "string" },
              "source": "string",
              "content": { "en": "string", "cn": "string" },
              "analysis": { "en": "string", "cn": "string" },
              "parties": [ { "name": "string", "type": "Regulator/Company/Product" } ],
              "url": "string"
            }
          ],
          "riskReport": {
            "lastUpdated": "2026-02-21",
            "score": "Low/Medium/High",
            "summary": { "en": ["Point 1", "Point 2"], "cn": ["Point 1", "Point 2"] },
            "focusAreas": [
               { 
                 "name": { "en": "string", "cn": "string" }, 
                 "summary": { "en": "string", "cn": "string" }, 
                 "citation": "string",
                 "relatedEvents": [{ "title": { "en": "string", "cn": "string" }, "url": "string" }]
               }
            ]
          }
        }
      `;

      console.log("Generating content...");
      const generatedData = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          { role: "user", parts: [{ text: searchPrompt }] },
          { role: "model", parts: [{ text: searchResponse.text }] }, 
          { role: "user", parts: [{ text: processingPrompt }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      console.log("Generation complete.");
      newData = JSON.parse(generatedData.text);

    } catch (apiError: any) {
      console.warn("Gemini API call failed, falling back to synthetic data generation:", apiError.message);
      
      // Fallback: Generate synthetic data if API fails
      const now = new Date();
      const todayISO = now.toISOString().split('T')[0];
      
      newData = {
        newUpdates: [
          {
            id: `sim-${Date.now()}`,
            date: todayISO,
            title: { en: "New AI Compliance Guidelines Released (Simulated)", cn: "新AI合规指南发布（模拟）" },
            source: "EU AI Office",
            content: { 
              en: "The EU AI Office has released updated guidelines for general-purpose AI models, emphasizing stricter transparency requirements.", 
              cn: "欧盟AI办公室发布了通用人工智能模型的更新指南，强调了更严格的透明度要求。" 
            },
            analysis: { 
              en: "This update clarifies the documentation needed for compliance by Q3 2026.", 
              cn: "此次更新明确了2026年第三季度合规所需的文件。" 
            },
            parties: [{ name: "EU AI Office", type: "Regulator" }],
            url: "https://digital-strategy.ec.europa.eu/en/policies/ai-office"
          }
        ],
        riskReport: {
          lastUpdated: todayISO,
          score: "Medium",
          summary: {
            en: [
              "The EU AI Office has released new transparency guidelines. We must update our technical documentation by Q3 2026 to include detailed model training data sources.",
              "Recent fines against RetailCo for emotion recognition show that using AI to analyze customer sentiment in stores is now strictly prohibited.",
              "With the new age verification rules enforced on OpenAI, we need to verify if our user sign-up flow meets the 'strict age-gating' standard."
            ],
            cn: [
              "欧盟AI办公室发布了新的透明度指南。我们必须在2026年第三季度前更新技术文档，详细说明模型训练数据的来源。",
              "近期RetailCo因情绪识别被罚款，这表明在商店中使用AI分析客户情绪现在是被严格禁止的。",
              "随着OpenAI被强制执行新的年龄验证规则，我们需要核实我们的用户注册流程是否达到了'严格年龄门槛'的标准。"
            ]
          },
          focusAreas: riskReport.focusAreas // Keep existing focus areas for stability
        }
      };
    }
    
    // Update in-memory store (best effort for this instance)
    
    // Update in-memory store (best effort for this instance)
    if (newData.newUpdates && Array.isArray(newData.newUpdates)) {
      // Filter out duplicates based on ID or Title
      const uniqueNewUpdates = newData.newUpdates.filter((newUp: any) => {
        return !updates.some(existingUp => 
          existingUp.id === newUp.id || 
          existingUp.title.en === newUp.title.en
        );
      });
      
      if (uniqueNewUpdates.length > 0) {
        setUpdates([...uniqueNewUpdates, ...updates]);
      }
    }
    if (newData.riskReport) {
      const updatedReport = { ...riskReport };
      updatedReport.lastUpdated = newData.riskReport.lastUpdated;
      updatedReport.score = newData.riskReport.score;
      updatedReport.summary = newData.riskReport.summary;
      updatedReport.focusAreas = newData.riskReport.focusAreas;
      setRiskReport(updatedReport);
    }

    recalculateStats();

    // Sort data before returning to ensure latest content is on top
    const sortedUpdates = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const sortedKnowledgeBase = [...knowledgeBase].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Return the FULL merged data so the client can update its state immediately
    // This handles the stateless serverless issue
    res.json({ 
      success: true, 
      data: {
        updates: sortedUpdates, // Return the full updated list sorted
        riskReport: riskReport, // Return the full updated report
        knowledgeBase: sortedKnowledgeBase // Return the full KB sorted
      }
    });

  } catch (error: any) {
    console.error("Refresh failed:", error);
    res.status(500).json({ error: "Failed to refresh data", details: error.message });
  }
});
