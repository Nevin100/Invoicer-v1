# Stage 1: Install dependencies
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --frozen-lockfile

# Stage 2: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_dummy
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV RAZORPAY_KEY_SECRET=dummy
ENV UPSTASH_REDIS_REST_URL=https://dummy.upstash.io
ENV UPSTASH_REDIS_REST_TOKEN=dummy
ENV MONGODB_URI=mongodb://localhost:27017/dummy
ENV JWT_SECRET=dummysecretdummysecretdummysecret32
ENV RESEND_API_KEY=re_dummy
ENV GOOGLE_CLIENT_ID=dummy
ENV GOOGLE_CLIENT_SECRET=dummy

RUN npm run build

# Stage 3 : Run the application
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]