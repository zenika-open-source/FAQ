# Configuration

FAQ is a multi-tenancy application with multi services. (Read [this documentation page](/docs/multi_tenancy.md) for more information about multi-tenancy in FAQ)

Each of these service has a configuration in the database.

The configuration is in the form of the following `Configuration` graphql type:

```graphql
type Configuration {
  id: ID! @unique

  name: String! @unique

  algoliaSynonyms: Json
  algoliaAppId: String
  algoliaApiKey: String

  auth0Domain: String!
  auth0ClientId: String!

  mailgunDomain: String
  mailgunApiKey: String

  slackChannelHook: String

  tags: Json!
}
```

> Note: `name`, `auth0Domain`, `auth0ClientId` and `tags` are required fields

You can have multiple `Configuration` object, but only the one with the name **"default"** will be read by the backend and frontend.

## Creating a configuration

Execute this mutation in your **Prisma service Playground**:

```graphql
mutation {
  createConfiguration(
    input: {
      name: "default"
      auth0Domain: ""
      ...
    }
  ) {
    id
    name
  }
}
```

> Use your own configuration variables: [Backing services](/docs/backing_services.md) and [integrations](/docs/integrations.md)

## Updating a configuration

Execute this mutation in your **Prisma service Playground**:

```graphql
mutation {
  updateConfiguration(
    where: {
      name: "default"
    }
    input: {
      auth0Domain: ""
      auth0ApiKey: ""
      ...
    }
  ) {
    id
    name
  }
}
```

> Use your own configuration variables: [Backing services](/docs/backing_services.md) and [integrations](/docs/integrations.md)
