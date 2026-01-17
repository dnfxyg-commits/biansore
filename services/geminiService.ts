import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI with API key strictly from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  try {
    // Generate content using the Gemini 3 Flash model with system instruction and user history
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are the BIANSoar 赋佐 AI Assistant, an expert in the Global Low-Altitude Economy (Drones, eVTOLs, Urban Air Mobility). Your goal is to help users find information about global low-altitude exhibitions, technology trends, and market insights. Be professional, concise, and forward-looking.",
        temperature: 0.7,
      }
    });

    return response.text || "Sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI service is currently unavailable. Please check your connection.";
  }
};

export const fetchLatestInsights = async () => {
  try {
    // Generate structured news items using JSON output mode and a defined response schema
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 3 short, catchy news items about the low-altitude economy (eVTOL, delivery drones, air traffic management). Focus on recent innovation and market growth.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              date: { type: Type.STRING },
              source: { type: Type.STRING }
            },
            required: ["id", "title", "summary", "date", "source"]
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text.trim()) : [];
  } catch (error) {
    console.error("News Generation Error:", error);
    return [];
  }
};