# Integrations

This project has the following integrations:

* [Slack](#slack)
* [Workplace](#workplace)
* [Public API](#public-api)

## Slack

Slack is a collaboration chat tool often used in and out of organizations to help team communicate and coordinate in a more effective manner.

FAQ has the following integration with slack:

* Sends new questions into a dedicated slack channel

### Create Slack application

In order to integrate with Slack, you will need to create an application. It can be done using the [Slack "Build" dashboard](https://api.slack.com/). Follow the instructions from Slack to create your app. See below for  your configuration variables.

### Configuration variables

| Name | Notes |
| -- |-- |
| `slackChannelHook` | This variable is a hook URI which is called by the backend in order to send the message to the channel. You can configure a hook on the [Slack "Build" dashboard](https://api.slack.com/). Choose your app, then go to "Features > Incoming Webhooks". Active the feature and create a hook for the dedicated channel you wish to send questions to. The generated url is what you need for this variable. |

## Workplace

Workplace is a collaborative platform run by Facebook and can be labeled as "Facebook for companies".

FAQ has the following integration with Workplace:

* Button to share a question on Workplace

### Configuration

There is no configuration needed for the workplace integration to work. Indeed, to share something with the Worplace API, we only need to open a popup with this url: `https://work.facebook.com/sharer.php?display=popup&u=[the_url_to_share]`

## Public API

FAQ has a public API in order to query its data.

### Configuration

1. Manually create a user with a `key` (You can use any string as a key, but we advise you to use a random 30 chars long string).
2. Create a JWT with the following payload, sign with the previously created key.
```
{
  "user-id": "[user_id]",
  "prisma-service": "[name]/[stage]",
  "iat": [timestamp_token_generated],
  "exp": [timestamp_token_expiration]
}
```
Example:
```js
{
  "user-id": "cjmymlydx01780b30irsmi203",
  "prisma-service": "demo/prod",
  "iat": 1538908112,
  "exp": 1538910112
}
```
3. Query the backend with a POST request with your GraphQL as the body. Add the following headers:
```
Authorization: API [your_jwt_token]
prisma-service: [name]/[state]
```
