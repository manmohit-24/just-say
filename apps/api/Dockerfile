# NOTE : Build context must be the repository root.

# Base
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# Prune workspace
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2 prune @repo/api --docker

# Install dependencies
FROM base AS installer
COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

# Build
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

ENV NODE_ENV=production \
    DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN pnpm build --filter=@repo/api...

# Deploy Build
FROM builder AS deploy
RUN pnpm --filter @repo/api deploy --prod /prod/api --legacy

# Database migrations
FROM builder AS migrator
CMD ["pnpm", "--filter", "@repo/db", "migrate:deploy"]

# Production runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deploy /prod/api ./
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
