import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { FastifyInstance } from "fastify";

export default async function chatRoute(app: FastifyInstance) {
  app.post("/api/chat", async (req, reply) => {
    const { messages, model, systemPrompt } = req.body as {
      messages?: Array<{ role: tool; content: string }>;
      model?: string;
      systemPrompt?: string;
    };
    // ✅ Add defensive checks
    if (!Array.isArray(messages) || messages.length === 0) {
      return reply
        .status(400)
        .send({ error: "messages must be a non-empty array" });
    }

    if (
      !messages.every(
        (msg) =>
          msg && typeof msg.content === "string" && typeof msg.role === "string"
      )
    ) {
      return reply.status(400).send({ error: "invalid message format" });
    }

    if (!model || !["gpt-3.5-turbo", "gpt-4"].includes(model)) {
      return reply.status(400).send({ error: "Unsupported model" });
    }

    const result = await streamText({
      model: model ? openai(model) : openai("gpt-4o-mini"),
      system:
        systemPrompt ||
        "You are a personal and professional assistant for Michael Albert aka mta630. Be helpful and adaptive.",
      messages,
    });

    reply.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Pipe the text stream directly to the Fastify response
    await result.pipeTextStreamToResponse(reply.raw);
  });
}
