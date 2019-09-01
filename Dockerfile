ARG VERSION=latest
FROM node:${VERSION}

label author="pritesh.kumar2@gmail.com"
label webstack="node.js"


ARG APPDIR="/node/techscraper"
run mkdir -p ${APPDIR}
copy . ${APPDIR}
workdir ${APPDIR}
run npm install


FROM node:alpine
label webstack="node"
label author="pritesh.kumar2@gmail.com"


ARG APP_VERSION=1.5
ENV NODE_PORT 8080
ENV NODE_ENV development

run mkdir -p /var/techscraper
copy --from=0 /node/techscraper /var/techscraper
workdir /var/techscraper

expose ${NODE_PORT}
cmd ["/bin/sh", "-c", "node server.js"]
