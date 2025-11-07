// src/services/openaiService.ts
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPEN_AI,
  dangerouslyAllowBrowser: true,
});

export const OpenAIService = {
  async sendMessage(prompt: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um assistente útil e objetivo." },
          { role: "user", content: prompt },
        ],
      });

      const message = response.choices[0]?.message?.content;
      return message ?? "Sem resposta.";
    } catch (error: any) {
      console.error("Erro na OpenAI API:", error);
      throw new Error(
        error?.response?.data?.error?.message ||
          "Erro na comunicação com a OpenAI"
      );
    }
  },

  async generateImage(prompt: string) {
    try {
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });
      return response?.data?.[0]?.url ?? "No image URL available";
    } catch (error: any) {
      console.error("Erro ao gerar imagem:", error);
      throw new Error("Falha ao gerar imagem com a OpenAI");
    }
  },
};
