# Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

The project has the following [dependencies](#dependencies):

* [Algolia](#algolia)\*
* [Auth0](#Auth0)
* [Google Cloud](#google-cloud)\*
* [Graphcool](#graphcool)\+
* [Mailgun](#mailgun)\*

> \* _optional, but recommended_
>
> \+ _local deployment available_

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

Before running the project, you will need to configure your environment variables from the [dependencies](#dependencies)

```bash
# Path: ./FAQ/
cp .env.local.example .env.local
vim .env.local

cp server/.env.local.example server/.env.local
vim server/.env.local
```

## Dependencies

### Algolia

[Algolia](https://www.algolia.com/) is used for the full-text search.

Deploy the algolia synonyms with the following command

```bash
# Path: ./FAQ/server
npm run algolia
```

> Note: Algolia is optional for the development.
>
> If you do not indicate an API key for Algolia, the application will simply
> return an empty result when searching

#### Keys

* App ID: _The name of your project_
* API key (all operations) and API key (search only): _Go to "API Keys > All API keys"_

### Auth0

[Auth0](https://auth0.com/) is used for authentication. This is required dependency.

#### Keys

* Domain: _Found in your client's settings_
* Client ID: _Found in your client's settings_

### Google Cloud

[Google Cloud](https://cloud.google.com/) is used to host the client on App Engine.

> Note: Google Cloud is an optional dependency

#### Keys

* Application ID: _ID of your project_

### Graphcool

[Graphcool](https://www.graph.cool/) is a Graphql-as-a-Service which holds the data. You can also deploy locally during development.

Install and configure a graphcool instance for your project. This is a required dependency.

```bash
# Path: ./FAQ/server
npm install

# Optional: if you want a local instance of graphcool (requires Docker)
graphcool local up

npm run graphcool
```

When deploying for the first time, you will need to choose a target region (us, eu or asia). It will then print the endpoints.

Your target key is: `[region]/[app_id]`

#### Keys

* Target: _See above_
* Endpoint URL: _Printed when deploying (use simple/v1)_

### Mailgun

[Mailgun](https://www.mailgun.com/) is used to send mails.

> Note: Mailgun is optional for the development.
>
> If you do not indicate an API key for Mailgun, the application will silently
> throw an error in graphcool logs

#### Keys

* Domain: _In the settings of your domain_
* API key: _In the settings of your domain_

## Start

Finally, start the application

```bash
# Path: ./FAQ/
npm start
```
