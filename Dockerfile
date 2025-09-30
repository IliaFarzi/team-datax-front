# ========== Builder Stage ==========
FROM node:20-bullseye-slim AS builder

# Default args (can be overridden by --build-arg)
ARG NODE_ENV=development
ARG NEXT_PUBLIC_API_BASE_URL
ARG FRONTEND_URL

WORKDIR /app

# Copy package files & install dependencies
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci --loglevel=verbose

# Copy source code
COPY . .

# Set envs for Next.js build
ENV NODE_ENV=${NODE_ENV} \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    FRONTEND_URL=${FRONTEND_URL}

# Build Next.js
RUN npm run build

# ========== Runner Stage ==========
FROM node:20-bullseye-slim AS runner

WORKDIR /app

# Runtime args
ARG NODE_ENV=development
ARG PORT=8050

ENV NODE_ENV=${NODE_ENV} \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=${PORT}

# Copy only the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create non-root user
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE ${PORT}
CMD ["node", "server.js"]
