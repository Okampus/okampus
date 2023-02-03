FROM node:18

WORKDIR /app
RUN adduser --uid 1111 api

RUN chown api:api /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN npm --no-update-notifier --no-fund --global install pnpm@7.26.0

ADD --chown=api:api package.json ./package.json
ADD --chown=api:api pnpm-lock.yaml ./pnpm-lock.yaml
ADD --chown=api:api nx.json ./nx.json

USER api
RUN pnpm i

ADD --chown=api:api . ./

# ADD --chown=api:api tsconfig.json ./tsconfig.json
# ADD --chown=api:api tsconfig.base.json ./tsconfig.base.json
# ADD --chown=api:api nx.json ./nx.json

# ADD --chown=api:api apps/api ./apps/api
# ADD --chown=api:api libs/api ./libs/api
# ADD --chown=api:api libs/shared ./libs/shared

RUN pnpm nx run api:build:production
RUN pnpm nx run api:build-migrations

EXPOSE 8081

CMD /wait && node dist/apps/api/migrate/main.js && node dist/apps/api/main.js