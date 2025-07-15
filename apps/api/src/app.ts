// apps/api/src/server.ts
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import chatRoute from "./routes/chat";
import helloWorld from "./routes/hello-world";

function build(opts = {}) {
  const schema = {
    type: "object",
    required: ["PORT", "UPSTASH_REDIS_REST_TOKEN", "UPSTASH_REDIS_REST_URL"],
    properties: {
      PORT: {
        type: "string",
        default: 7111,
      },
      UPSTASH_REDIS_REST_URL: { type: "string" },
      UPSTASH_REDIS_REST_TOKEN: { type: "string" },
      OPENAI_API_KEY: { type: "string" },
    },
  };
  const app = Fastify({
    logger: true,
  });

  // cors plugin register
  app.register(cors, { origin: "*" });

  // @fastify/env plugin register
  const options = {
    dotenv: true,
    confKey: "config",
    schema: schema,
  };
  app.register(fastifyEnv, options);

  // ROUTE REGISTERS
  app.register(chatRoute);
  app.register(helloWorld);

  return app;
}

export default build;
