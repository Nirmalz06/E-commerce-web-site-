import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Helper to get the AI client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getProductRecommendations = async (
  query: string,
  availableProducts: Product[]
): Promise<{ text: string; recommendedIds: string[] }> => {
  const ai = getAiClient();
  if (!ai) {
    return {
      text: "I'm sorry, I can't connect to my brain right now. Please try again later.",
      recommendedIds: [],
    };
  }

  // Create a simplified catalog for the AI to process to save tokens
  const catalogContext = availableProducts.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.description,
    category: p.category,
    tags: p.tags,
    price: p.price
  }));

  const prompt = `
    You are an expert Art Curator for an online poster shop.
    
    User Query: "${query}"

    Available Catalog:
    ${JSON.stringify(catalogContext)}

    Task:
    1. Analyze the user's request and match it with the most relevant posters from the catalog.
    2. Select up to 3 best matches.
    3. Provide a friendly, short explanation of why you picked them.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                message: { type: Type.STRING, description: "A friendly message to the user explaining the choices." },
                productIds: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "The IDs of the recommended products." 
                }
            }
        }
      },
    });

    if (response.text) {
        const result = JSON.parse(response.text);
        return {
            text: result.message || "Here are some finds.",
            recommendedIds: result.productIds || []
        };
    }
    
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return {
      text: "I had some trouble curating specific art for you, but please browse our collection!",
      recommendedIds: [],
    };
  }
};