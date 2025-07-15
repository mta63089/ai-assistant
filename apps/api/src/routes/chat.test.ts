import { beforeAll, describe, expect, it } from "vitest";
import build from "../app";

describe("POST /api/chat", () => {
  const server = build();

  beforeAll(async () => {
    await server.ready();
  });

  it("returns 200 and text response for valid payload", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/chat",
      payload: {
        messages: [{ role: "user", content: "Hello!" }],
        model: "gpt-4",
      },
      headers: { "x-forwarded-for": "127.0.0.1" },
    });

    expect(res.statusCode).toBe(200);

    // 👇 Manually consume the response stream
    const reader = res.body.getReader();
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }

    expect(result).toContain("Hello");
  });

  it("returns 400 for missing messages", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/chat",
      payload: { model: "gpt-4" },
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("messages must be a non-empty array");
  });

  it("returns 400 for empty messages array", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/chat",
      payload: { messages: [], model: "gpt-4" },
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("messages must be a non-empty array");
  });

  it("returns 200 and uses custom system prompt", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/chat",
      payload: {
        messages: [{ role: "user", content: "Tell me a joke." }],
        systemPrompt: "You are a funny assistant.",
        model: "gpt-4",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("returns 400 for unknown model", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/chat",
      payload: {
        messages: [{ role: "user", content: "hi" }],
        model: "banana-brain-v2",
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("Unsupported model");
  });

  it("returns 400 for completely empty payload", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/chat",
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });
});
