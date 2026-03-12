const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function streamGLMChat(messages: ChatMessage[]) {
  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GLM_MODEL || "glm-4-flash",
      messages,
      stream: true,
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`GLM API error: ${response.status}`);
  }

  return response;
}

export const SYSTEM_PROMPT = `你是 PawPal 宠友圈的 AI 宠物匹配师「小爪」。你的职责是：

1. **宠物性格分析**：根据用户描述的宠物品种、年龄、性格，分析其社交特点
2. **匹配建议**：推荐适合交朋友的宠物品种和性格类型
3. **养护咨询**：提供专业的宠物社交、养护建议
4. **互动引导**：引导用户使用 PawPal App 的匹配功能

你的性格：热情、专业、可爱，偶尔用宠物相关的表情和语气词。
回复保持简洁（100-200字），用中文回答。每次回复末尾可以推荐1-2个匹配建议。`;
