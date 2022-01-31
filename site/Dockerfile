FROM node:16.13.1-alpine3.12

WORKDIR /app

RUN adduser -HD site
COPY .env ./
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod 777 ./

EXPOSE 8080
USER site

CMD ["npm", "run", "serve"]
