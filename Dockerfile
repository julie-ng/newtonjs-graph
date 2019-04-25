FROM node:10
MAINTAINER Julie Ng <me@julie.io>

WORKDIR /workspace

# cache dependencies as layer
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production

COPY ["demo/", "/workspace/demo/"]

EXPOSE ${PORT:-80}
CMD ["npm", "run", "demo:server"]
