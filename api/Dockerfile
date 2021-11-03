FROM node:16.12.0-alpine3.12

WORKDIR /app
RUN adduser -HD api

ADD .env ./
ADD package*.json ./
RUN npm install
ADD . ./

RUN chown -R api:api .
EXPOSE 5000
USER api

RUN npx mikro-orm schema:create -R
CMD ["npm", "run", "start:dev"]
