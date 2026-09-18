FROM node:20-alpine
WORKDIR /app
COPY package.json server.mjs send.mjs ./
USER node
EXPOSE 8787
CMD ["node", "server.mjs"]
