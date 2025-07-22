# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json bun.lockb* ./
RUN npm install || bun install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
