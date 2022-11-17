FROM node:18.9.1-alpine3.16

EXPOSE 8080

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build
RUN yarn test

CMD [ "yarn", "start:prod" ]
