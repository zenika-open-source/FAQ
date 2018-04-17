# Backing services

The project has the following backing services:

* [Algolia](#algolia)\*
* [Auth0](#Auth0)
* [Google Cloud](#google-cloud)\*
* [Graphcool](#graphcool)\+
* [Mailgun](#mailgun)\*

> \* _optional, but recommended_
>
> \+ _local deployment available_

## Algolia

[Algolia](https://www.algolia.com/) is used for full-text search.

> Note: Algolia is optional for development.
>
> If you do not indicate an API key for Algolia, the application will simply
> return an empty result when searching

In Algolia, you can use synonyms to improve full-text search (eg: "travel <=> trip").

You can define these synonyms in the [synonyms.json](/server/algolia/synonyms.json) file.

Deploy these synonyms with the following command:

```bash
# Path: ./FAQ/server
npm run algolia
```

### Environment variables

#### `REACT_APP_ALGOLIA_APP_ID`

_Used by: Front-end & back-end_

This variable is the ID of your Algolia project. You can find it on your project interface on the [Algolia dashboard](https://www.algolia.com/dashboard). It should be a string of 10 char (digit or uppercase letter).

#### `REACT_APP_ALGOLIA_API_KEY_ALL`

_Used by: Back-end_

This variable is an API Key with the following operation access rights: `search`, `addObject`, `deleteObject`, `editSettings`. You can create an API key on your [Algolia dashboard](https://www.algolia.com/dashboard): Go to "API Keys > All API keys"

#### `REACT_APP_ALGOLIA_API_KEY_SEARCH`

_Used by: Front-end_

This variable is an API Key with the following operation access rights: `search`. You can create an API key on your [Algolia dashboard](https://www.algolia.com/dashboard): Go to "API Keys > All API keys"

> Note: Because this key is available in the front-end, you should only give it the `search` access right for security reasons.

## Auth0

[Auth0](https://auth0.com/) is used for authentication. This is required dependency.

> Note: Auth0 is required

### Environment variables

#### `REACT_APP_AUTH0_DOMAIN`

_Used by: Front-end & back-end_

Its value should be the Auth0 domain against which the app should authenticate. It ends with `auth0.com` and it can be found on the [Auth0 dashboard](https://manage.auth0.com).

> If you have a zenika.com email address, you may use `zenika.eu.auth0.com`.

#### `REACT_APP_AUTH0_CLIENTID`

_Used by: Front-end & back-end_

Its value should be the id of your Auth0 client against which the app should authenticate. It looks like a long string of random chars and can be found on the [Auth0 dashboard](https://manage.auth0.com): Go to "Clients > [Your client] > Settings"

> If you have a zenika.com email address, you may use `wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p`

## Google Cloud

[Google Cloud](https://cloud.google.com/) is used to host the front-end on App Engine.

> Note: Google Cloud is an optional dependency

### Environment variables

#### `GCLOUD_APP_ID`

_Used by: Front-end_

Its value should be the id of your Google Cloud project ID. It looks like a slug (eg: "my-project") and can be found on the [Google Cloud console](https://console.cloud.google.com).

## Graphcool

[Graphcool](https://www.graph.cool/) is a Graphql-as-a-Service which holds the data. This is a required backing service, but you can deploy locally during development.

> Note: Graphcool is required but you can use a local instance

### Configuration

> Optional: If you want a local graphcool instance, run `npm run graphcool local up` from the `server` folder

* Deploy the server: `npm run graphcool deploy` from the `server` folder
* Choose the cluster of your server (_local, us, eu or asia_)
* Choose the local name for your target key (_eg: "dev"_)
* Choose the service name for your server (_eg: "faq"_)
* After deployment the CLI will show the endpoints URIs to use to configure the front-end (see Environment variables below)

After this configuration, you won't be asked all these information again when deploying.

### Environment variables

#### `GRAPHCOOL_TARGET`

_Used by: Back-end_

> Note: If you don't intend to deploy with a CI, you don't need this variable

Its value represents the target of your Graphcool application. It has the following format `[cluster]/[app_id]` where `cluster` is what you chose when deploying for the first time.

> Note: You can also find the target in the ./server/.graphcoolrc file after deploying at least once

#### `REACT_APP_GRAPHCOOL_URI`

_Used by: Front-end_

Its value is the URL that will be used for graphql querying. It has the following format `https://api.graph.cool/simple/v1/[app_id]` and can be found in the console when [deploying your back-end](/docs/installation.md#start).

#### `REACT_APP_GRAPHCOOL_URI_WS`

_Used by: Front-end_

Its value is the URL that will be used for graphql subscriptions. It has the following format `wss://subscriptions.graph.cool/v1/[app_id]` and can be found in the console when [deploying your back-end](/docs/installation.md#start).

## Mailgun

[Mailgun](https://www.mailgun.com/) is used to send mails.

> Note: Mailgun is optional for the development.
>
> If you do not indicate an API key for Mailgun, the application will silently
> throw an error in graphcool logs

### Environment variables

#### `MAILGUN_DOMAIN`

_Used by: Back-end_

Its value should be the domain associated with the email sent by this project (eg: faq.zenika.com). It can be found on the [Mailgun dashboard](https://app.mailgun.com).

#### `MAILGUN_API_KEY`

_Used by: Back-end_

Its value should be the api key used to send emails. It looks like a long string of random letters starting with "key-" and can be found in the settings of your project on the [Mailgun dashboard](https://app.mailgun.com).
