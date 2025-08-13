import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generatePrepTips = async (company: string, role: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("<p>API Key not configured. This feature is disabled.</p>");
    }

    const prompt = `
        You are a helpful career coach bot for university students.
        Generate concise and actionable preparation tips for a student interviewing for a "${role}" position at "${company}".
        
        Structure your response as simple HTML. Use <h3> for headings (e.g., <h3>Technical Focus</h3>) and <ul> with <li> for bullet points.
        Do not include <html>, <head>, or <body> tags.
        Provide specific, example-based advice where possible. Keep it friendly and encouraging.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating prep tips:", error);
        return "<p>Sorry, I couldn't generate tips at the moment. Please try again later.</p>";
    }
};
