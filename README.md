# Parse and extract

Test out modern models document extraction capabilities

## Description

- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- [Prisma](https://www.prisma.io/) is used as ORM to interact with a PostgreSQL database.

- [OpenAI](https://openai.com/) SDK is used to interact with OpenAI API.

## Shortcut

If you just want to run the whole project without going through the setup steps,
you can run the following commands:

```bash
$ mv .env.example .env
# update the OPENAI_API_KEY in .env file
$ npm run start:full
```

Make sure you have Docker Compose installed on your machine.

## How to test/Swagger

Swagger is included, so once the project is running, you can access it at:

```
http://localhost:3000/api
```

It is also recommended to have the Prisma Studio running to inspect the database:

```bash
$ npm run start:studio
```

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

Remember to apply migratations before running the project for the first time.
```bash
# To apply migrations, run:
$ npm run migrate
```

```bash
# To create a new migration, run:
$ npx prisma migrate dev --name <migration_name>
# After this, you can generate the Prisma client again with:
$ npx prisma generate
# this will generate all the required types for the new schema
```

## Compile and run the project locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Design Decisions, Trade-offs, and Future Improvements

I took many shortcuts for this project to save time. Think of it as a happy path
POC. I went with OpenAI as a provider since I know their SDK is good, there are many
resources available and the models are good.

### List of missing features

* Tests
* Authorization on the endpoints
* Error handling everywhere
* Duplicate check on uploaded files
* More lenient querying
* General refactor of the code with cleanup
* Run through the performance
* Possibly return job id right away when processing, instead of holding the HTTP connection
* Better logging
* Reassess choice of AI model


### Tradeoffs
There is of course lots of things you can do with the data cleaning step. We
want only the relevant parts, but we also want to include everything that is
relevant. You can create "parsers" for all types of documents, and in some cases
that makes sense, in others not. It sort of depends on how structured the data
is as well. 

For the danish html resource I noticed that it never picked up the case number.
So I had to add a special rule that included the sidebar div and its text
content. 

The same comes to the prompting. The more context we give to the prompt the
better it will be. I also didn't specify a result language, but that is also
something to be included.

I went with one of OpenAIs most expensive models in hope of getting the best
results. In the future I would look at cheaper models and compare their
capabilites.
