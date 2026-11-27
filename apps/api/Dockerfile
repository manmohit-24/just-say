# syntax=docker/dockerfile:1.7
# Build context must be the repository root.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruned
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@2.10.4 prune @repo/api --docker

FROM base AS deps
WORKDIR /app
COPY --from=pruned /app/out/json/ ./
COPY --from=pruned /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY --from=pruned /app/out/full/ ./
ENV NODE_ENV=production
RUN pnpm --filter @repo/api... build

FROM node:22-alpine AS runner
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production API_PORT=3001
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /app/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=builder --chown=node:node /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder --chown=node:node /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder --chown=node:node /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=node:node /app/packages/db/src/generated ./packages/db/src/generated
COPY --from=builder --chown=node:node /app/packages/jobs/package.json ./packages/jobs/package.json
COPY --from=builder --chown=node:node /app/packages/jobs/dist ./packages/jobs/dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=node:node /app/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=builder --chown=node:node /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder --chown=node:node /app/packages/jobs/node_modules ./packages/jobs/node_modules
USER node
EXPOSE 3001
CMD ["node", "apps/api/dist/server.js"]
