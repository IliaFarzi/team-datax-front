# Declare build-time args
ARG NODE_ENV
ARG NEXT_PUBLIC_API_BASE_URL
ARG FRONTEND_URL

# ---------- Build stage ----------
FROM node:20-bullseye-slim AS builder

# Pass args as environment variables during build
ENV NODE_ENV=${NODE_ENV} \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    FRONTEND_URL=${FRONTEND_URL}

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci --loglevel=verbose
COPY . .

# Build Next.js app
RUN npm run build

# ---------- Runner stage ----------
FROM node:20-bullseye-slim AS runner

# Pass the same build args to runtime
ARG NODE_ENV
ARG NEXT_PUBLIC_API_BASE_URL
ARG FRONTEND_URL

# Make all env vars available in the running container
ENV NODE_ENV=${NODE_ENV} \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    FRONTEND_URL=${FRONTEND_URL} \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8050

WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 8050
CMD ["node", "server.js"]
