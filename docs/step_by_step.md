# Step by step installation

This is the quickest process to install and run this project with the minimum [backing services](/docs/backing_services.md) required.

## 1/ Global dependencies

First, you will need the following dependencies:

- Docker >= 16 and docker-compose >= 1.18 (See https://www.docker.com)
- Node >= 8 and npm >= 5 (See https://nodejs.org)

> These are the currently known minimum version required. An earlier version may still work.

## 2/ Clone repository

Clone this repository

```bash
git clone https://github.com/Zenika/FAQ
```

## 3/ Install project dependencies

```bash
# Path: ./FAQ/
npm install

# Path: ./FAQ/server
npm install
```

## 4/ Initialize local Prisma instance

Run the following commands in order to create a local prisma instance

```bash
# Path: ./FAQ/server
npm run docker_local_up
npm run deploy
```

## 5/ Create your environment files

This project uses 2 `.env.local` file to configure its environment variables.

- The first `.env.local` file (for the frontend) needs to be created at the root of the project.

```
REACT_APP_AUTH0_DOMAIN=zenika.eu.auth0.com
REACT_APP_AUTH0_CLIENTID=wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p

REACT_APP_GRAPHQL_ENDPOINT=http://localhost:4000/gql
REACT_APP_PRISMA_SERVICE=default/default
```

- The second `.env.local` file (for the backend) needs to be created in the `server` folder.

```
FAQ_URL=faq.zenika.com

PRISMA_URL=http://localhost:4466
PRISMA_MANAGEMENT_API_SECRET=my-secret-42

AUTH0_DOMAIN=zenika.eu.auth0.com
AUTH0_CLIENTID=wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p
```

## 6/ Run the backend

```bash
# Path: ./FAQ/server
npm start
```

## 7/ Run the frontend

```bash
# Path: ./FAQ/
npm start
```

And you should now have an up and running FAQ!

But wait! It's only the slim version with only the required backing services. If you want more (e.g.: Algolia, Slack, Mailgun, ...), you will need to follow the [complete installation](/docs/installation.md) of the project.
