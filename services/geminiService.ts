
import { GoogleGenAI } from "@google/genai";

export const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCreativeIdea = async (wishes: string[]) => {
  if (wishes.length === 0) return "许愿池目前还是空的，快邀请好友来留言吧！";
  
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `我是一个钢琴家兼画家，这是我好友留下的愿望清单：${wishes.join('; ')}。请根据这些愿望，为我构思一个结合了钢琴演奏和绘画艺术的创意跨界项目建议。用中文回复，语气要富有艺术气息且充满鼓励。`,
      config: {
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 正在闭关修炼，请稍后再试。";
  }
};

export const polishCaption = async (draft: string) => {
  if (!draft || draft.length < 2) return draft;
  
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一个极具艺术气息的博主。请帮我润色这段动态配文，使其更有质感、更感性、更动人。原话是： "${draft}"`,
      config: {
        temperature: 0.9,
      },
    });
    return response.text;
  } catch (error) {
    return draft;
  }
};
