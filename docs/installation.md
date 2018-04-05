# Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

This project requires the following accounts and keys:

* [Algolia](https://www.algolia.com) - App ID; API key (all operations); API key (search only)
* [Auth0](https://auth0.com) - Domain; Client ID
* [Google Cloud](https://cloud.google.com) - Application ID
* [Graphcool](https://www.graph.cool) - Endpoint URL
* [Mailgun](https://www.mailgun.com) - Domain; API key

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

> /!\ This project currently relies on Graphcool cloud even for development
>
> In the future, we will use the graphcool local deployment feature

Install and configure the graphcool instance for your project

```bash
# Path: ./FAQ/server
npm install
npm run graphcool
```

## Algolia

> /!\ Algolia is a cloud service and there is no local alternative
>
> In the future, we will provide a Stub class in order to use this application without Algolia when developing

Deploy the algolia synonyms with the following command

```bash
# Path: ./FAQ/server
npm run algolia
```

## Start

Finally, start the application

```bash
# Path: ./FAQ/
npm start
```
