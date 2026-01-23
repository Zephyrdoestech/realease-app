import { Alert } from 'react-native';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// --- 1. FOR SELLERS: Auto-Write Descriptions (Used in add.tsx) ---
export const generateListingDescription = async (
  title: string,
  location: string,
  price: string,
  features: string
) => {
  if (!GEMINI_API_KEY) {
    console.error("Missing Gemini API Key");
    return null;
  }

  const prompt = `
    Act as a professional Real Estate Broker in Cebu, Philippines. 
    Write a catchy, persuasive listing description (max 150 words) for:
    - Title: ${title}
    - Location: ${location}
    - Price: ₱${price}
    - Key Specs: ${features}

    Requirements:
    - Use a professional yet inviting tone.
    - Use 3-5 emojis.
    - Highlight that this property is "Verified by RealEase" for safety.
    - Write ONLY the description.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate.";
  } catch (error) {
    console.error("AI Gen Error:", error);
    return null;
  }
};

// --- 2. FOR BUYERS: AI Concierge General Knowledge (Used in ai-concierge.tsx) ---
export const getAIGeneralResponse = async (userQuery: string) => {
  if (!GEMINI_API_KEY) {
    console.error("Missing Gemini API Key");
    return "I'm sorry, my API key is not configured.";
  }

  const prompt = `
    You are the "RealEase AI Concierge," an expert in Philippine Real Estate, specifically for Cebu and surrounding areas.
    The user is asking: "${userQuery}"

    Task:
    - Provide helpful, professional advice about real estate in the Philippines.
    - If they ask for locations, suggest real-world popular areas in Cebu (e.g., IT Park, Mactan, Banawa).
    - Provide estimated market prices based on your knowledge.
    - Use emojis and a friendly "Pinoy" tone (English or Taglish).
    - Mention that for verified listings, they should check the RealEase Explore tab.
    - Keep your answer under 120 words.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure about that. Could you ask something else?";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the internet. Please try again later.";
  }
};