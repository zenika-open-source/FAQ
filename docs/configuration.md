# Configuration

FAQ is a multi-tenancy application with multi services. (Read [this documentation page](/docs/multi_tenancy.md) for more information about multi-tenancy in FAQ)

Each of these service has a configuration in the database.

The configuration is in the form of the following `Configuration` graphql type:

```graphql
type Configuration {
  id: ID! @unique

  name: String! @unique

  algoliaAppId: String
  algoliaApiKey: String
  algoliaSynonyms: Json

  auth0Domain: String!
  auth0ClientId: String!

  mailgunDomain: String
  mailgunApiKey: String

  slackChannelHook: String

  tags: Json
}
```

> Note: `name`, `auth0Domain` and `auth0ClientId` are required fields

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

> See below for a list of configuration variables

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

> See below for a list of configuration variables

## Configuration variables

**name**

You can use any name you want, but only the configuration with the name `default` will be used by the application.

**algoliaAppId, algoliaApiKey and algoliaSynonyms**

Configuration for Algolia. See [Backing services](/docs/backing_services.md) for more information.

**auth0Domain and auth0ClientId**

Configuration for Auth0. See [Backing services](/docs/backing_services.md) for more information.

**mailgunDomain and mailgunApiKey**

Configuration for Mailgun. See [Backing services](/docs/backing_services.md) for more information.

**slackChannelHook**

Configuration for the Slack integration. See [integrations](/docs/integrations.md) for more information.

**tags**

This is a JSON Object representing your tags. It must follow this schema:

```json
{
  "categorie1": ["tag1", "tag2", "tag3"],
  "categorie2": ["tag4", "tag5"]
}
```

Example:

```json
{
  "services": [
    "paie",
    "ops",
    "recrutement",
    "marketing",
    "rh",
    "dsi",
    "dt",
    "compta",
    "formation",
    "ce"
  ],
  "agency": [
    "nantes",
    "paris",
    "rennes",
    "lyon",
    "lille",
    "bordeaux",
    "singapour",
    "montréal"
  ],
  "theme": [
    "nouvel arrivant",
    "formateur",
    "fin du mois",
    "mission",
    "tutoriel",
    "matériel",
    "meta"
  ]
}
```
