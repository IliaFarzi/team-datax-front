
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && apk add --no-cache libc6-compat
COPY . .
RUN npm run build
RUN adduser -S nextjs -u 1001
USER nextjs
EXPOSE 8050
CMD ["node", ".next/standalone/server.js"]