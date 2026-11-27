# syntax=docker/dockerfile:1.7
# Prisma migration utility image; build context is the repository root.
FROM node:22-alpine
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/db/package.json ./packages/db/package.json
COPY packages/db/prisma.config.ts ./packages/db/prisma.config.ts
COPY packages/db/prisma ./packages/db/prisma
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile --filter @repo/db...
WORKDIR /app
CMD ["pnpm", "--filter", "@repo/db", "migrate:deploy"]
