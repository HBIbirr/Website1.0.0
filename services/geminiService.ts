
import { GoogleGenAI } from "@google/genai";

// 初始化 AI (API Key 自动注入)
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const polishContent = async (text: string, type: 'post' | 'resource') => {
  if (!text.trim()) return text;
  
  const model = 'gemini-3-flash-preview';
  const prompt = type === 'post' 
    ? `你是一位优雅的艺术家。请将以下直白的文字润色成一段富有艺术感、感性且适合发布在个人动态上的文字，保持在100字以内： "${text}"`
    : `你是一位专业的资源库管理员。请为名为 "${text}" 的艺术资源写一段吸引人的、专业的简介，突出其价值，保持在150字以内。`;

  try {
    // When using generate content for text answers, use ai.models.generateContent
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: { 
        temperature: 0.7, 
        // maxOutputTokens is set here to ensure enough budget for the response
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // The GenerateContentResponse object features a text property (not a method)
    return response.text?.trim() || text;
  } catch (error) {
    console.error("AI 润色失败:", error);
    return text;
  }
};
