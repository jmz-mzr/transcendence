FROM node:20-alpine AS base

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs



FROM base AS deps

## Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --chown=nestjs:nodejs package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile && yarn cache clean --all; \
  elif [ -f package-lock.json ]; then npm ci && npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile && pnpm store prune; \
  else echo "Lockfile not found." && exit 1; \
  fi



FROM base AS build

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs . ./

ENV PATH=/app/node_modules/.bin:$PATH

RUN npx prisma generate \
  && npm run build \
  && chown -R nestjs:nodejs ./dist \
  && chown -R nestjs:nodejs ./node_modules/.prisma/client



FROM build AS dev

RUN apk add --no-cache dumb-init
## In case of a prisma studio 'Error: spawn xdg-open ENOENT':
# RUN apk add xdg-utils

## For a simpler 'CMD' instruction, consider launching the container
## with the "CMD ["dumb-init", "/usr/local/bin/entrypoint.sh"]" (line 58)
## after having uncommented this 'COPY' instruction:
## (The script loads the env from the mounted secrets, but hides it
## from both the image and the running container)
# COPY --from=resources --chown=nestjs:nodejs ./entrypoint.dev.sh /usr/local/bin/entrypoint.sh

ENV NODE_ENV=development
ENV FRONTEND_URL ${FRONTEND_URL}

USER nestjs:nodejs

# CMD ["dumb-init", "/usr/local/bin/entrypoint.sh"]
CMD ["dumb-init", "sh", "-c", "source /run/secrets/back-env \
  && prisma db push --accept-data-loss && { prisma studio & } \
  && exec nest start --watch --preserveWatchOutput"]



FROM base AS prod

RUN apk add --no-cache dumb-init

COPY --from=resources --chown=nextjs:nodejs ./healthcheck.js /usr/local/bin/
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --chown=nestjs:nodejs prisma ./prisma
COPY --chown=nestjs:nodejs package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

ENV NODE_ENV=production

RUN \
  if [ -f yarn.lock ]; then yarn --production --offline --ignore-scripts --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm prune --omit=dev; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --prod --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi \
  && rm -f package.json yarn.lock* package-lock.json* pnpm-lock.yaml*

ENV FRONTEND_URL ${FRONTEND_URL}
ENV BACKEND_URL=${BACKEND_URL}
ENV PATH=/app/node_modules/.bin:$PATH

USER nestjs:nodejs

EXPOSE 3000

HEALTHCHECK --interval=1m --timeout=10s CMD ["node", "/usr/local/bin/healthcheck.js"]

CMD ["dumb-init", "sh", "-c", "source /run/secrets/back-env \
  && prisma migrate deploy && prisma generate \
  && exec node dist/main"]
