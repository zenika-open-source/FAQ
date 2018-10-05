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

## Service routing in production

While in production, the service accessed will depend on the url you are at:

```
https://[service_stage?].[service_name?].[FAQ_URL]/
```

| name          | value                                       |
| ------------- | ------------------------------------------- |
| FAQ_URL       | Provided from environment variables         |
| service_name  | The name of the service. Default: `default` |
| service_stage | The stage of the service. Default: `prod`   |

Examples with FAQ_URL=faq.zenika.com (`name / stage`):

- faq.zenika.com => `default / prod`
- demo.faq.zenika.com => `demo / prod`
- dev.demo.faq.zenika.com => `demo / dev`

> Note: If NODE_ENV==dev or if no FAQ_URL is found in your environment variables, the default routing will return `default/default`

> Note: The routing can be overrided using REACT_APP_PRISMA_SERVICE=name/stage
