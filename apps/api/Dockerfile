# syntax=docker/dockerfile:1.7
# Build context must be the repository root.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruned
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@2.11.13 prune @repo/api --docker

FROM base AS deps
WORKDIR /app
COPY --from=pruned /app/out/json/ ./
COPY --from=pruned /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY --from=pruned /app/out/full/ ./
# turbo prune omits root config files that aren't declared as package dependencies.
COPY --from=pruned /app/tsconfig.base.json ./tsconfig.base.json
ENV NODE_ENV=production
RUN pnpm --filter @repo/api... build

# Keep the pruned workspace layout intact in the runtime image.
# This preserves pnpm's workspace symlinks and their targets.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production API_PORT=3001
COPY --from=builder --chown=node:node /app/ ./
USER node
EXPOSE 3001
CMD ["node", "apps/api/dist/server.js"]
