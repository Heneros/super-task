FROM node:23.11.1

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apt-get update \
 && apt-get install -y netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app 
COPY nest/package.json nest/pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile
COPY nest/ .

ENV NODE_ENV=development
ENV CI=true

EXPOSE 3000

CMD ["sh", "-c", "pnpm run start:dev"]
