FROM node:23.11.1


RUN npm install -g pnpm

WORKDIR /usr/src/app 

COPY super-next/pnpm-lock.yaml super-next/pnpm-workspace.yaml* ./

COPY super-next/package.json ./


RUN pnpm install  --prod=false

COPY super-next/ ./


EXPOSE 3001 

CMD ["pnpm", "dev"]