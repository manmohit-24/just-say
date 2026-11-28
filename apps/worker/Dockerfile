# NOTE : Build context must be the repository root.

# Base
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# Prune workspace
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2 prune @repo/worker --docker

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

RUN pnpm build --filter=@repo/worker...

# Deploy Build
FROM builder AS deploy
RUN pnpm --filter @repo/worker deploy --prod /prod/worker --legacy

# Production runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deploy /prod/worker ./
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
