# FAQ Zenika

Internal Knowledge Database for Zenika members - https://faq-zenika.now.sh

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need an [Auth0](https://auth0.com/) account, a [Now](https://zeit.co/now) account, a [Graphcool](https://www.graph.cool/) account and an [Algolia](https://www.algolia.com/) account to use this project

For this project, you will need the following keys:

* Auth0 domain
* Auth0 client id (also called: api identifier)
* Now application name
* Now authorization token
* Graphcool endpoint url
* Algolia app id
* Algolia api key (all operations)
* Algolia api key (search only)

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
vim .graphcoolrc
graphcool deploy --target=dev
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

## Deployment

The deployment to Now and Graphcool can be executed using the following command

```bash
npm run deploy
```

## License

This project is under the MIT License - See the [LICENSE.md](LICENSE.md) file for details

## Security

**Be careful!** Markdown is inherently unsafe to XSS attacks. There is currently **no** defense in place to mitigate it.

This will need to be fixed **before** launching the project.
