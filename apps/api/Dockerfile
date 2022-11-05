FROM node:18

WORKDIR /app
RUN adduser --uid 1111 api

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

ADD ./scripts /scripts
RUN chmod -R +x /scripts

RUN chown api:api ./
USER api

ADD --chown=api:api package*.json ./
RUN npm install --force

ADD --chown=api:api . ./

RUN npm run build

EXPOSE 8081

CMD /wait && /scripts/launch.sh
