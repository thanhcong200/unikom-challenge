FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./
RUN npm install --frozen-lockfile

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .env.example ./
COPY .env ./

RUN npm install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 8000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
