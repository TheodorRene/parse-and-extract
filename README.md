## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
[Prisma](https://www.prisma.io/) is used as ORM to interact with a PostgreSQL
database.
[OpenAI](https://openai.com/) SDK is used to interact with OpenAI API.


## Shortcut

If you just want to run the whole project without going through the setup steps,
you can run the following commands:
```bash
$ mv .env.example .env
# update the OPENAI_API_KEY in .env file
$ npm run start:full
```

Make sure you have Docker Compose installed on your machine.

## Project setup

```bash
$ npm install
```

## Database setup

```bash
npm run start:db
```

This will start a PostgreSQL database in docker.
The credentials are hardcoded for convenience in `docker-compose.yml`
Since this is a test project, there is a an example env file `.env.example`.
You can copy it to `.env` and modify it if needed, but the default url should
work out of the box. From there you will also have to add your OpenAI API key.

## Migration setup with Prisma

```bash
# To apply migrations, run:
$ npx prisma migrate deploy
```

```bash
# To create a new migration, run:
$ npx prisma migrate dev --name <migration_name>
# After this, you can generate the Prisma client again with:
$ npx prisma generate
# this will generate all the required types for the new schema
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
