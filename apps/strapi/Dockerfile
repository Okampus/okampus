FROM node:18-alpine

WORKDIR /app
RUN adduser -D --uid 2222 strapi

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN chown strapi:strapi ./
USER strapi

ADD --chown=strapi:strapi package*.json ./
RUN npm install --force
RUN npm install pg

ADD --chown=strapi:strapi . ./

RUN npm run build

EXPOSE 1337

CMD /wait && npm run start
