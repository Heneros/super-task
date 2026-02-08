# Task SuperHeroes


Backend (Documentation): <a href="http://localhost:3000/api">localhost:3000/api</a>

Frontend: <a href="http://localhost:3001">localhost:3001</a>


## Assumptions 

- PostgreSQL and Redis for structured data and relational db.

- Docker compose iit provides stable environment and allows the project to be launched on any machine.(The application can also be started locally)

- RTK Query is used on the frontend to handle server state, caching, and data synchronization.

- NestJS is used as the backend framework because it provides strong CQRS arch and maintain scalable application. It also makes it convenient to write unit tests and doc. using Jest and Swagger.

- Image express storage is implemented locally for simplicity. But in app still you can use Cloudinary s3(the integration code is commented but fully functional)

## Run Application with Node.js


<b>Rename file .env.example to .env  </b>
```
mv .env.example .env
```

<b>Install Dependencies</b>

Install all dependencies using pnpm:
```
pnpm install
```


<b>Start Infrastructure (PostgreSQL & Redis)</b>


Run base services via Docker:
```
pnpm run docker:base
```

<b>Initialize database schema (Prisma)</b>

Apply Prisma schema and generate tables:

```
pnpm run prisma:build
```



<b>Start Application</b>
Run backend and frontend in development mode:

```
pnpm run dev
```

Run unit tests

```
pnpm run unit
```


## Launch app through Docker Compose

Rename file .env.example to .env 
```
mv .env.example .env
```

Build project

```
pnpm run docker:build
```


Initialize database schema (Prisma)
Apply Prisma schema and generate tables:

```
pnpm run prisma:build
```


Run unit tests

```
pnpm run unit
```