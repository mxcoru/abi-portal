
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./
RUN npm install -g pnpm
RUN  pnpm install --production
RUN  pnpx prisma generate

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm install -g pnpm
RUN pnpm install -D tailwindcss@latest postcss@latest autoprefixer@latest
RUN pnpx prisma generate

RUN pnpm run build

FROM node:slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN npx prisma generate

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]