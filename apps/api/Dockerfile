# Dockerfile (apps/api)
FROM node:22

WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm -F api build

VOLUME ["/app/uploads"]

CMD ["pnpm", "start"]
