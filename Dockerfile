# ---------- build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL is only needed at runtime; dummy value so the build does not fail
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npm run build

# ---------- runtime stage ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/app/uploads

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY start.sh ./start.sh

RUN mkdir -p /app/uploads && chmod +x ./start.sh
EXPOSE 3000
CMD ["./start.sh"]
