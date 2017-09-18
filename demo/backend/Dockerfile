FROM node:alpine
MAINTAINER Mark Ronald Delos Santos (markrdelossantos@hotmail.com)

ADD package.json /tmp/package.json
RUN mkdir /app
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules/ /app/node_modules/

RUN npm install --global nodemon

ENTRYPOINT cd /app; nodemon --ignore dist/ -L --exec npm run dev