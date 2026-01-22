import { Alert } from 'react-native';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
    Write a catchy real estate listing description (max 150 words) for:
    Title: ${title}
    Location: ${location}
    Price: ₱${price}
    Details: ${features}
    Use emojis. Highlight lifestyle benefits.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};