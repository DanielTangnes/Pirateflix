# ---------- Build stage ----------
FROM node:16-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build React app
COPY public ./public
COPY src ./src
COPY server ./server
RUN npm run build

# ---------- Runtime stage ----------
FROM node:16-bullseye-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy only what we need for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/build ./build

EXPOSE 4000
CMD ["node", "server/index.js"]


