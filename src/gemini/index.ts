import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const googleGemini = {
  async generateContent(prompt: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { response: response.text() };
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate content with Gemini");
    }
  }
};