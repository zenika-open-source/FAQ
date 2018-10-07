# Backing services

The project has the following backing services:

- [Algolia](#algolia)\*
- [Auth0](#Auth0)
- [Mailgun](#mailgun)\*

> \* _optional, but recommended_

## Algolia

[Algolia](https://www.algolia.com/) is used for full-text search.

> Note: Algolia is optional for development.
>
> If you do not indicate an API key for Algolia, the application will simply
> return an empty result when searching

In Algolia, you can use synonyms to improve full-text search (eg: "travel <=> trip").

You can define synonyms in the [synonyms.json](/server/scripts/algolia_settings/synonyms.json) file.

Don't forget to redeploy after you edited the file

```bash
# Path: ./FAQ/server
npm run deploy
```

### Configuration variables

| Name | Notes |
| -- | -- |
| `algoliaAppId`| This variable is the ID of your Algolia project. You can find it on your project interface on the [Algolia dashboard](https://www.algolia.com/dashboard). It should be a string of 10 chars (digit or uppercase letter). |
| `algoliaApiKey` | This variable is the admin API key. You can find it on your [Algolia dashboard](https://www.algolia.com/dashboard): Go to "API Keys > Your API Keys" |

## Auth0

[Auth0](https://auth0.com/) is used for authentication. This is required dependency.

> Note: Auth0 is **required**

### Configuration variables

| Name | Notes |
| -- | -- |
| `auth0Domain` | Its value should be the Auth0 domain against which the app should authenticate. It ends with `auth0.com` and it can be found on the [Auth0 dashboard](https://manage.auth0.com). |
| `auth0ClientId` | Its value should be the id of your Auth0 client against which the app should authenticate. It looks like a long string of random chars and can be found on the [Auth0 dashboard](https://manage.auth0.com): Go to "Clients > [Your client] > Settings" |

> If you have a zenika.com email address, you can use the following credentials:
>
> `auth0Domain` = `zenika.eu.auth0.com`
>
> `auth0ClientId` = `wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p`

## Mailgun

[Mailgun](https://www.mailgun.com/) is used to send mails.

> Note: Mailgun is optional for the development.
>
> If you do not indicate an API key for Mailgun, the application will silently
> warn in the backend logs

### Configuration variables

| Name | Notes |
| -- | -- |
| `mailgunDomain` | Its value should be the domain associated with the email sent by this project (eg: faq.zenika.com). It can be found on the [Mailgun dashboard](https://app.mailgun.com). |
| `mailgunApiKey` | Its value should be the api key used to send emails. It looks like a long string of random letters starting with "key-" and can be found in the settings of your project on the [Mailgun dashboard](https://app.mailgun.com). |
