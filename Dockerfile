FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN rm -rf ./node_modules /dist package-lock.json
# && npm config set registry http://host.docker.internal:4874 && npm install
CMD ["npm","run","build"]