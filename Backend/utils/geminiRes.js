import "dotenv/config";
import { GoogleGenAI } from "@google/genai";


// This is like a client that uses the specified api key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const getGeminiResponse = async (message) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",  // model
        contents: message, // Input or Prompt
    });
    
    // Basically extract the output of the response and this is exactly what will be sent to the frontend
    return response.text;
}

export default getGeminiResponse;