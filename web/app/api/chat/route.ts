import { streamGLMChat, SYSTEM_PROMPT, type ChatMessage } from "@/lib/glm";

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "messages is required" }, { status: 400 });
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.slice(-20), // Keep last 20 messages for context
    ];

    const glmResponse = await streamGLMChat(fullMessages);

    // Forward the SSE stream from GLM to the client
    return new Response(glmResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
