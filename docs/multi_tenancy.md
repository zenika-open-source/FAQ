# Multi-tenancy

FAQ is a multi-tenancy application. You can have multiple services served with only instance of the stack (Frontend / Backend / Prisma / DB).

If you do not specify a service during the installation, you will have a default service name and stage (default/default).

## How to create a new service

First, execute this mutation in the Prisma Playground

> If you are in a local environment and didn't changed prisma settings, you can probably find it at: http://localhost:4466

```graphql
mutation {
  addProject(
    input: {
      name: "YOUR_SERVICE_NAME"
      stage: "YOUR_SERVICE_STAGE"
      secrets: ["YOUR_SECRET"]
    }
  ) {
    project {
      name
      stage
    }
  }
}
```

Then, redeploy all your services from the /server directory

```
# Path: FAQ/server
npm run deploy
```

You now have:

- A new service in Prisma
- A new index in Algolia
