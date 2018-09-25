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

You can define synonyms in the [synonyms.json](/server/algolia/synonyms.json) file.

Deploy these synonyms with the following command:

```bash
# Path: ./FAQ/server
npm run algolia
```

### Environment variables

| Name | Used by | Notes |
| -- | -- | -- |
| `ALGOLIA_APP_ID` | Backend | This variable is the ID of your Algolia project. You can find it on your project interface on the [Algolia dashboard](https://www.algolia.com/dashboard). It should be a string of 10 chars (digit or uppercase letter). |
| `API_KEY_ALL` | Backend | This variable is an API Key with the following operation access rights: `search`, `addObject`, `deleteObject`, `editSettings`. You can create an API key on your [Algolia dashboard](https://www.algolia.com/dashboard): Go to "API Keys > All API keys" |

## Auth0

[Auth0](https://auth0.com/) is used for authentication. This is required dependency.

> Note: Auth0 is required

### Environment variables

| Name | Used by | Notes |
| -- | -- | -- |
| `REACT_APP_AUTH0_DOMAIN` & `AUTH0_DOMAIN` | Frontend & Backend | Its value should be the Auth0 domain against which the app should authenticate. It ends with `auth0.com` and it can be found on the [Auth0 dashboard](https://manage.auth0.com). |
| `REACT_APP_AUTH0_CLIENTID` & `AUTH0_CLIENTID` | Frontend & Backend | Its value should be the id of your Auth0 client against which the app should authenticate. It looks like a long string of random chars and can be found on the [Auth0 dashboard](https://manage.auth0.com): Go to "Clients > [Your client] > Settings" |

> If you have a zenika.com email address, you may use:
>
> `AUTH0_DOMAIN` = `zenika.eu.auth0.com`
>
> `AUTH0_CLIENTID` = `wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p`

## Mailgun

[Mailgun](https://www.mailgun.com/) is used to send mails.

> Note: Mailgun is optional for the development.
>
> If you do not indicate an API key for Mailgun, the application will silently
> throw an error in the backend logs

### Environment variables

| Name | Used by | Notes |
| -- | -- | -- |
| `MAILGUN_DOMAIN` | Backend | Its value should be the domain associated with the email sent by this project (eg: faq.zenika.com). It can be found on the [Mailgun dashboard](https://app.mailgun.com). |
| `MAILGUN_API_KEY` | Backend | Its value should be the api key used to send emails. It looks like a long string of random letters starting with "key-" and can be found in the settings of your project on the [Mailgun dashboard](https://app.mailgun.com). |
