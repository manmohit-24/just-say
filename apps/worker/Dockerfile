# syntax=docker/dockerfile:1.7
# Build context must be the repository root.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruned
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@2.10.4 prune @repo/worker --docker

FROM base AS deps
WORKDIR /app
COPY --from=pruned /app/out/json/ ./
COPY --from=pruned /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY --from=pruned /app/out/full/ ./
ENV NODE_ENV=production
RUN pnpm --filter @repo/worker... build

FROM node:22-alpine AS runner
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=node:node /app/apps/worker/package.json ./apps/worker/package.json
COPY --from=builder --chown=node:node /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder --chown=node:node /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder --chown=node:node /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=node:node /app/packages/db/src/generated ./packages/db/src/generated
COPY --from=builder --chown=node:node /app/packages/jobs/package.json ./packages/jobs/package.json
COPY --from=builder --chown=node:node /app/packages/jobs/dist ./packages/jobs/dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=builder --chown=node:node /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder --chown=node:node /app/packages/jobs/node_modules ./packages/jobs/node_modules
USER node
CMD ["node", "apps/worker/dist/index.js"]
