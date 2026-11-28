# syntax=docker/dockerfile:1.7
# Build context must be the repository root.
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruned
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@2.11.13 prune @repo/web --docker

FROM base AS deps
WORKDIR /app
COPY --from=pruned /app/out/json/ ./
# Use the repository lockfile: Turbo's pnpm 11 pruned lockfile misses importer specifiers.
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY --from=pruned /app/out/full/ ./
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL NODE_ENV=production
# the trailing ... also builds the workspace packages the web app imports (@repo/contracts)
RUN pnpm --filter @repo/web... build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
