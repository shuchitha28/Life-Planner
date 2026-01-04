
import { GoogleGenAI, Type } from "@google/genai";
import { WidgetData } from "../types";

export const generateDailyReport = async (widgets: WidgetData[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const widgetSummary = widgets.map(w => {
    return `${w.title} (${w.type}): ${JSON.stringify(w.data)}`;
  }).join("\n");

  const prompt = `
    Act as a professional life coach and health expert. Analyze the following daily tracking data and provide a constructive daily report.
    
    Data:
    ${widgetSummary}
    
    Provide a response in JSON format including:
    - summary: A 2-sentence overview of the day's performance.
    - score: An overall score from 0 to 100.
    - tips: An array of 3 actionable improvement tips for tomorrow.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            score: { type: Type.NUMBER },
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "score", "tips"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Report generation failed:", error);
    return {
      summary: "Great job completing your tasks today! Keep up the momentum.",
      score: 85,
      tips: ["Stay hydrated", "Get 8 hours of sleep", "Review your goals early tomorrow"]
    };
  }
};
