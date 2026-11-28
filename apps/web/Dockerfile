# NOTE : Build context must be the repository root.

# Base
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# Prune workspace
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2 prune @repo/web --docker

# Install dependencies
FROM base AS installer
COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

# Build
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

ENV NEXT_PUBLIC_API_URL=http://localhost:3001 \
    NEXT_PUBLIC_APP_URL=http://localhost:3000 \
    NODE_ENV=production

RUN pnpm build --filter=@repo/web...

# Production runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next/standalone/ ./
COPY --from=builder /app/apps/web/.next/static/ ./apps/web/.next/static/

# If the app has a public directory:
COPY --from=builder /app/apps/web/public/ ./apps/web/public/

USER node
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
