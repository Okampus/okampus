FROM node:16.12.0-alpine3.12

WORKDIR /app

RUN adduser -HD site
COPY .env ./
COPY package*.json ./
RUN npm install
COPY . .

RUN chown -R site:site .

EXPOSE 8080
USER site

CMD ["npm", "run", "serve"]
