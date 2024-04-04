FROM node:20-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs



FROM base AS deps

## Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --chown=nextjs:nodejs package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile && yarn cache clean --all; \
  elif [ -f package-lock.json ]; then npm ci && npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile && pnpm store prune; \
  else echo "Lockfile not found." && exit 1; \
  fi



FROM base AS dev

RUN apk add --no-cache dumb-init \
  && mkdir .next \
	&& chown nextjs:nodejs .next

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . ./

ENV NODE_ENV=development
ENV BACKEND_URL=${BACKEND_URL}
ENV NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}
ENV PATH=/app/node_modules/.bin:$PATH

USER nextjs:nodejs

CMD ["dumb-init", "next", "dev", "--port", "4000"]



FROM base AS build

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . ./

ENV NODE_ENV=production
ARG NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi \
  && rm -fr node_modules



FROM base AS prod

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV FRONTEND_URL=${FRONTEND_URL}
ENV BACKEND_URL=${BACKEND_URL}

COPY --from=resources --chown=nextjs:nodejs ./healthcheck.js /usr/local/bin/
COPY --from=build /app/public ./public

RUN mkdir -p .next \
  && chown nextjs:nodejs .next

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs:nodejs

EXPOSE 4000

ENV PORT=4000

HEALTHCHECK --interval=1m --timeout=10s CMD ["node", "/usr/local/bin/healthcheck.js"]

CMD ["dumb-init", "node", "server.js"]
