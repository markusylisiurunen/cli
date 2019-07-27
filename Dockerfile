FROM node:12.6 AS builder

WORKDIR /var/app

COPY . .

RUN npm ci && npm run build
RUN npm prune --production

FROM node:12.6-alpine

ENV NODE_ENV=production

WORKDIR /var/app

COPY --from=builder /var/app/package.json .
COPY --from=builder /var/app/node_modules ./node_modules
COPY --from=builder /var/app/build ./build

CMD ["node", "build/index.js"]
