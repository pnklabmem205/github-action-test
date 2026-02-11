# 최소 앱용 Dockerfile (실제 NestJS 등으로 교체 가능)
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
