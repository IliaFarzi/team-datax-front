# ---------- Build stage ----------
FROM node:20-bullseye-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci --loglevel=verbose
COPY . .

# Build-time args
ARG NODE_ENV
ARG BACKEND_URL
ARG FRONTEND_URL

# Pass args to Next.js build
ENV NEXT_PUBLIC_NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL
ENV NEXT_PUBLIC_FRONTEND_URL=$FRONTEND_URL

# Build Next.js app
RUN npm run build

# ---------- Runner stage ----------
FROM node:20-bullseye-slim AS runner

ENV NEXT_TELEMETRY_DISABLED=1 \
    PORT=8050

WORKDIR /app

# Copy standalone output + static assets + public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 8050

# Start standalone server
CMD ["node", "server.js"]
