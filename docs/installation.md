# Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

This project requires the following accounts and keys:

* [Algolia](https://www.algolia.com)\* - App ID; API key (all operations); API key (search only)
* [Auth0](https://auth0.com) - Domain; Client ID
* [Google Cloud](https://cloud.google.com)\* - Application ID
* [Graphcool](https://www.graph.cool) - Target; Endpoint URL [local instance available]
* [Mailgun](https://www.mailgun.com)\* - Domain; API key

\* _optional, but recommended_

## Installing

First, clone the repository

```bash
# Path: ./
git clone https://github.com/Zenika/FAQ
```

Then, install the dependencies of the project

```bash
# Path: ./FAQ/
npm install
```

## Configuration

Before running the project, you will need to configure your environment variables

```bash
# Path: ./FAQ/
cp .env.local.example .env.local
vim .env.local

cp server/.env.local.example server/.env.local
vim server/.env.local
```

## Graphcool

Install and configure a graphcool instance for your project

```bash
# Path: ./FAQ/server
npm install

# Optional: if you want a local instance of graphcool (requires Docker)
graphcool local up

npm run graphcool
```

## Algolia

Deploy the algolia synonyms with the following command

```bash
# Path: ./FAQ/server
npm run algolia
```

> Note: Algolia is optional for the development.
>
> If you do not indicate an API key for Algolia, the application will simply
> return an empty result when searching

## Mailgun

> Note: Mailgun is optional for the development.
>
> If you do not indicate an API key for Mailgun, the application will silently
> throw an error in graphcool logs

## Start

Finally, start the application

```bash
# Path: ./FAQ/
npm start
```
