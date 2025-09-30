# ---------- Build stage ----------
FROM node:20-bullseye-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci --loglevel=verbose
COPY . .

# Build-time args
#          there is bug in building react app for production https://nextjs.org/docs/messages/no-document-import-in-page
#ARG NODE_ENV
ARG BACKEND_URL

# Pass args to Next.js build
ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL

# Build Next.js app
RUN npm run build

# ---------- Runner stage ----------
FROM node:20-bullseye-slim AS runner

#          there is bug in building react app for production https://nextjs.org/docs/messages/no-document-import-in-page
#ARG NODE_ENV=development

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8050
ENV NODE_ENV=development

WORKDIR /app

# Copy standalone output + static assets + public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 8050

# Start standalone server
CMD ["node", "server.js"]
