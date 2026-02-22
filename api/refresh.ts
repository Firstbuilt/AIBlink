import { GoogleGenAI } from "@google/genai";
import { knowledgeBase, updates, riskReport, recalculateStats, setUpdates, setRiskReport, setKnowledgeBase } from '../src/data/store';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Search for latest news
    const model = "gemini-2.5-flash"; // Supports grounding
    const searchPrompt = "Latest EU AI regulation news, privacy compliance updates, and enforcement actions from last 3 months. Include specific company names and regulators involved. Find links to sources. Focus on finding actual enforcement cases.";
    
    const searchResponse = await ai.models.generateContent({
      model: model,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });

    const processingPrompt = `
      Current Date: February 21, 2026.
      Based on the search results (or if limited, simulate realistic scenarios for early 2026 based on the AI Act timeline):
      1. Create 2-3 new update items in JSON format.
      2. Generate a comprehensive risk assessment.
      3. CRITICAL: Identify the TOP 5 Critical Compliance Areas. Prioritize areas with recent ENFORCEMENT ACTIONS or major news.
      4. Review existing Knowledge Base items. If any "Draft" or "Proposal" has likely become "Legislation" or "Standard" by Feb 2026, provide an updated list of modified knowledge base items.
      
      Structure:
      {
        "newUpdates": [
          {
            "id": "string",
            "date": "YYYY-MM-DD",
            "title": { "en": "string", "cn": "string" },
            "source": "string",
            "content": { "en": "string", "cn": "string" },
            "analysis": { "en": "Brief expert commentary", "cn": "简短专家点评" },
            "parties": [ { "name": "string", "type": "Regulator/Company/Product" } ],
            "url": "string (URL to the source)"
          }
        ],
        "riskReport": {
          "lastUpdated": "2026-02-21",
          "score": "Low/Medium/High",
          "summary": { 
             "en": ["Detailed Point 1 (3-5 sentences)", "Detailed Point 2 (3-5 sentences)", "Detailed Point 3 (3-5 sentences)"], 
             "cn": ["详细要点1 (3-5句话)", "详细要点2 (3-5句话)", "详细要点3 (3-5句话)"] 
          },
          "focusAreas": [
             { 
               "name": { "en": "string", "cn": "string" }, 
               "summary": { "en": "Detailed summary (1-3 sentences)", "cn": "详细总结 (1-3句话)" }, 
               "citation": "string",
               "relatedEvents": [
                 { "title": { "en": "string", "cn": "string" }, "url": "string" }
               ]
             }
          ]
        },
        "updatedKnowledgeBaseItems": [
           {
             "id": "string (existing ID if updating, or new)",
             "title": { "en": "string", "cn": "string" },
             "type": "Legislation/Guidance/Standard",
             "jurisdiction": { "en": "string", "cn": "string" },
             "date": "YYYY-MM-DD",
             "summary": { "en": "string", "cn": "string" },
             "url": "string"
           }
        ]
      }
      
      Return a JSON object with keys "newUpdates", "riskReport", and "updatedKnowledgeBaseItems".
    `;

    const generatedData = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: searchPrompt }] },
        { role: "model", parts: [{ text: searchResponse.text }] }, 
        { role: "user", parts: [{ text: processingPrompt }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const newData = JSON.parse(generatedData.text);
    
    // Update in-memory store
    if (newData.newUpdates && Array.isArray(newData.newUpdates)) {
      setUpdates([...newData.newUpdates, ...updates]);
    }
    if (newData.riskReport) {
      const updatedReport = { ...riskReport };
      updatedReport.lastUpdated = newData.riskReport.lastUpdated;
      updatedReport.score = newData.riskReport.score;
      updatedReport.summary = newData.riskReport.summary;
      updatedReport.focusAreas = newData.riskReport.focusAreas;
      setRiskReport(updatedReport);
    }

    if (newData.updatedKnowledgeBaseItems && Array.isArray(newData.updatedKnowledgeBaseItems)) {
       const updatedKB = [...knowledgeBase];
       newData.updatedKnowledgeBaseItems.forEach((newItem: any) => {
         const index = updatedKB.findIndex(kb => kb.id === newItem.id || kb.title.en === newItem.title.en);
         if (index !== -1) {
           updatedKB[index] = { ...updatedKB[index], ...newItem };
         } else {
           updatedKB.push(newItem);
         }
       });
       setKnowledgeBase(updatedKB);
    }

    recalculateStats();

    res.status(200).json({ success: true, data: newData });

  } catch (error) {
    console.error("Refresh failed:", error);
    res.status(500).json({ error: "Failed to refresh data" });
  }
}
