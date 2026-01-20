import { Alert } from 'react-native';

// ⚠️ STEP 1: PASTE YOUR API KEY INSIDE THE QUOTES BELOW 
const GEMINI_API_KEY = "PASTE_YOUR_AIza_KEY_HERE"; 

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface ListingDetails {
  title: string;
  location: string;
  price: string | number; // ✅ FIX: Allow string input from text fields
  bedrooms?: string | number; // ✅ FIX: Allow string input
  bathrooms?: string | number; // ✅ FIX: Allow string input
  features?: string[];
}

export const generateListingDescription = async (
  details: ListingDetails
): Promise<string> => {
  try {
    // 1. Validate API key
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('PASTE_YOUR')) {
      throw new Error('Please paste your Google Gemini API Key in lib/gemini.ts');
    }

    // 2. Safe Price Formatting (Handle Strings vs Numbers)
    const numericPrice = typeof details.price === 'string' 
      ? parseFloat(details.price.replace(/,/g, '')) 
      : details.price;
      
    const formattedPrice = isNaN(numericPrice) 
      ? details.price 
      : `₱${numericPrice.toLocaleString('en-PH')}`;

    // 3. Build prompt
    const prompt = `
      Act as a professional Real Estate Agent in the Philippines.
      Write a catchy, attractive listing description (under 150 words) for:
      
      Title: ${details.title}
      Location: ${details.location}
      Price: ${formattedPrice}
      Details: ${details.bedrooms} Beds, ${details.bathrooms} Baths

      Requirements:
      - Use emojis 🏠✨
      - Sound exciting but professional.
      - Focus on the lifestyle (convenience, comfort).
      - Do NOT include a "Contact Us" placeholder at the end.
    `;

    // 4. API Request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error('AI Service Unavailable');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();

  } catch (error: any) {
    console.error('Error generating description:', error);
    Alert.alert("AI Error", error.message);
    return ""; // Return empty string on failure so app doesn't crash
  }
};