FROM node:22.14.0-alpine

RUN apk add --no-cache curl openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN npx prisma generate

CMD npx prisma migrate deploy && npm start