ARG NODE_ENV=development

FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci --loglevel=verbose
COPY . .
RUN npm run build

FROM node:20-bullseye-slim AS runner
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV} NEXT_TELEMETRY_DISABLED=1 PORT=8050
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN adduser --system --uid 1001 nextjs
USER nextjs
EXPOSE 8050
CMD ["node", "server.js"]