# Deployment

Here are some useful informations about the deployment of this application:

## Prerequisites

Same prerequisites as [installation.md](/docs/installation.md#prerequisites)

## Backends

The deployment to Google Cloud and Graphcool can be executed using the following command

```bash
# Path: ./FAQ/
npm run build
npm run deploy_graphcool
npm run deploy_appengine
```

## CircleCI

This project comes with a CircleCI configuration folder.
The configuration will build and deploy the application following the environment variables.

> Note: To allow CircleCI to deploy to google cloud, you first need to authenticate
> with the Google Cloud Platform: https://circleci.com/docs/2.0/google-auth/#authenticate-the-gcloud-tool
