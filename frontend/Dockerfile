FROM node:alpine
MAINTAINER Mark Ronald Delos Santos (markrdelossantos@hotmail.com)

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir /app && mv tmp/node_modules/ /app/node_modules/

ENTRYPOINT  cd /app && npm start