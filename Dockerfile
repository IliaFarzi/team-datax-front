FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci  # نصب تمام وابستگی‌ها (شامل devDependencies برای اطمینان)
COPY . .
ENV NEXT_PUBLIC_API_BASE_URL=http://62.60.198.4:8040
RUN npm list typescript || echo "TypeScript is not installed"
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN adduser -S nextjs -u 1001
USER nextjs
EXPOSE 8050
CMD ["node", "server.js"]