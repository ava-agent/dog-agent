const DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/coding/v3";
const DEFAULT_ARK_MODEL = "doubao-seed-2-0-code-preview-260215";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function getArkChatCompletionsUrl() {
  const baseUrl = process.env.ARK_BASE_URL ?? DEFAULT_ARK_BASE_URL;
  return `${baseUrl.replace(/\/$/, "")}/chat/completions`;
}

export async function streamArkChat(messages: ChatMessage[]) {
  const apiKey = process.env.ARK_API_KEY;

  if (!apiKey) {
    throw new Error("ARK_API_KEY is not configured");
  }

  const response = await fetch(getArkChatCompletionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.ARK_CHAT_MODEL ?? DEFAULT_ARK_MODEL,
      messages,
      stream: true,
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Ark API error: ${response.status}${detail ? ` ${detail}` : ""}`
    );
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
