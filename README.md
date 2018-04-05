# FAQ Zenika

Internal Knowledge Database for Zenika members - https://faq.zenika.com

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project requires the following accounts and keys:

* [Algolia](https://www.algolia.com) - App ID; API key (all operations); API key (search only)
* [Auth0](https://auth0.com) - Domain; Client ID
* [Google Cloud](https://cloud.google.com) - Application ID
* [Graphcool](https://www.graph.cool) - Endpoint URL
* [Mailgun](https://www.mailgun.com) - Domain; API key

### Installing

First, clone the repository

```bash
git clone https://github.com/Zenika/FAQ.git
```

Then, install the dependencies of the project

```bash
cd FAQ
npm install
```

### Configuration

Before running the project, you will need to configure your environment variables

```bash
cp .env.local.example .env.local
vim .env.local

cp server/.env.local.example server/.env.local
vim server/.env.local
```

### Graphcool

> /!\ This project currently relies on Graphcool cloud even for development
>
> In the future, we will use the graphcool local deployment feature

Install and configure the graphcool instance for your project

```bash
cd server
npm install
npm run deploy
```

### Start

Finally, start the server

```bash
npm start
```

## Running the tests

> /!\ There is currently no tests for this project

### Coding style tests

Run the linter using the following command

```bash
npm run lint
```

## Contributing

### Algolia Synonyms

To add a synonym for Algolia's full-text search, modify the [synonyms.json](server/algolia/synonyms.json) file.

Documentation: https://www.algolia.com/doc/guides/textual-relevance/synonyms/

## Deployment

The deployment to Google Cloud and Graphcool can be executed using the following command

```bash
npm run build
npm run deploy_graphcool
npm run deploy_appengine
```

## CircleCI

This project comes with a CircleCI configuration folder.
The configuration will build and deploy the application following the environment variables.

> Note: To allow CircleCI to deploy to google cloud, you first need to authenticate
> with the Google Cloud Platform: https://circleci.com/docs/2.0/google-auth/#authenticate-the-gcloud-tool

## License

This project is under the MIT License - See the [LICENSE.md](LICENSE.md) file for details
