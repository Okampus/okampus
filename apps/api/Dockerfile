FROM node:16.15.1-alpine3.16

WORKDIR /app
RUN adduser -HD --uid 1111 api

ADD .env ./
ADD package*.json ./
ADD . ./
RUN chmod -R +x ./scripts
RUN chmod 777 ./
RUN npm install --force
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

EXPOSE 8081
USER api

CMD /wait && ./scripts/launch.sh
