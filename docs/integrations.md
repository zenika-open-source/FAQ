# Integrations

This project has the following integrations:

* [Slack](#slack)
* [Workplace](#workplace)

## Slack

Slack is a collaboration chat tool often used in and out of organizations to help team communicate and coordinate in a more effective manner.

FAQ has the following integration with slack:

* Sends new questions into a dedicated slack channel

### Configuration

In order to integrate with Slack, you will need to create an application. It can easily be done using the [Slack "Build" dashboard](https://api.slack.com/). Follow the instructions from Slack to create your app. See below for configuration for your environment variables.

### Environment variables

#### `SLACK_CHANNEL_HOOK`

_Used by: Back-end_

This variable is a hook which is called by the backend in order to send the message to the channel. You can configure a hook on the [Slack "Build" dashboard](https://api.slack.com/). Choose your app, then go to "Features > Incoming Webhooks". Active the feature and create a hook for the dedicated channel you wish to send questions to. The generated url is what you need for this variable.

## Workplace

Workplace is a collaborative platform run by Facebook and can be labeled as "Facebook for companies".

FAQ has the following integration with Workplace:

* Button to share a question on Workplace

### Configuration

There is no configuration needed for workplace to work.
