FROM node:18-alpine

WORKDIR /app

COPY road-signs-project/package.json ./
COPY road-signs-project/pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY road-signs-project/ ./

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
