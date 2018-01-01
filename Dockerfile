FROM node:9-alpine

RUN ["mkdir", "/app"]

ADD build /app/build
ADD package.json /app/package.json

WORKDIR /app

RUN ["yarn", "--production"]

ENV PORT 80

CMD ["yarn", "serve"]
