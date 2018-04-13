# FAQ Zenika

Internal Knowledge Database for Zenika members - https://faq.zenika.com

## What is FAQ?

**FAQ** is an **internal knowledge database** for Zenika members. It aims to be the **"single source of truth"** for most of Zenika-oriented information: "How does the variable part of the salary work?", "Can the client ask me to stay late at work?", ...

## Philosophy

* **Single source of truth:** Regrouping useful information
* **Intuitive:** Not only developer-oriented
* **Integrated:** Works well with the Zenika tool suite
* **Internationalized:** Open to the world

## Architecture

#### Frontend

* **JS:** React (react-router, apollo)
* **CSS:** Custom-made

#### Backend

* **Graphcool:** GraphQL-as-a-Service, Function-as-a-Service and hosting the data
* **Algolia:** FullTextSearch-as-a-Service
* **Mailgun:** Mail-as-a-Service
* **Google App Engine:** Hosting-as-a-Service (static)
* **Auth0:** Auth-as-a-Service

#### Integrations

* **Slack:** Sending new questions into a dedicated channel
* **Workplace:** Button to share questions

## Documentation

More documentation available here:

* [Installation](/docs/installation.md)
* [Deployment](/docs/deployment.md)
* [Contributing](/docs/contributing.md)

## License

This project is under the MIT License - See the [LICENSE.md](LICENSE.md) file for details
