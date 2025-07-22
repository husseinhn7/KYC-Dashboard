# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build && npm prune --production
EXPOSE 5000
CMD ["node", "dist/server.js"]