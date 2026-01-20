# Stage 1: Build & Test
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test  # Quality Gate inside Docker build

# Stage 2: Production Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "src/server.js"]
