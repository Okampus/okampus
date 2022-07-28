FROM node:16

WORKDIR /app

ADD .env ./
ADD package*.json ./
ADD . ./
RUN chmod 777 ./

RUN npm install
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

EXPOSE 1337

CMD /wait && npm start
