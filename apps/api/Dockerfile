FROM node:current-alpine

WORKDIR /app
RUN adduser -D --uid 1111 api

RUN chown api:api /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN npm --no-update-notifier --no-fund --global install pnpm@7.27.0
RUN mkdir -p /app/dist/apps/api/database && chown -R api:api /app/dist

ADD --chown=api:api package.json ./package.json
ADD --chown=api:api pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i --frozen-lockfile

ADD --chown=api:api nx.json ./nx.json
ADD --chown=api:api tsconfig.json ./tsconfig.json
ADD --chown=api:api tsconfig.base.json ./tsconfig.base.json

ADD --chown=api:api apps/api ./apps/api
ADD --chown=api:api libs/api ./libs/api
ADD --chown=api:api libs/shared ./libs/shared

RUN pnpm tsc --pretty -p apps/api/tsconfig.migrations.json
RUN pnpm vite build --config apps/api/vite.config.ts --mode production

USER api

EXPOSE 8081

CMD /wait && pnpm cross-env MIKRO_ORM_MIGRATION=up node dist/apps/api/main.mjs && node dist/apps/api/main.mjs