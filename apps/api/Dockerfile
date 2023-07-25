FROM node:current-alpine
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

WORKDIR /app
RUN adduser -D --uid 1111 api

RUN chown api:api /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN npm --no-update-notifier --no-fund --global install pnpm@8.6.10
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

RUN pnpm vite build --config apps/api/vite.config.ts --mode production
RUN pnpm tsc --pretty -p apps/api/tsconfig.migrations.json

USER api

EXPOSE 8081

CMD /wait && pnpm cross-env MIKRO_ORM_MIGRATION=up node dist/apps/api/main.mjs && cd apps/api/database/hasura && hasura metadata apply && cd ../../../../ && node dist/apps/api/main.mjs