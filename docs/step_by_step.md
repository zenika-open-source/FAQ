# Step by step installation

This is the quickest process to install and run this project with the minimum [backing services](/docs/backing_services.md) required.

## 1/ Global dependencies

First, you will need the following dependencies:

* Docker >= 16 and docker-compose >= 1.18 (See https://www.docker.com)
* Node >= 8 and npm >= 5 (See https://nodejs.org)
* Webpack >= 4 (`npm install -g webpack`)
* Graphcool >= 0.11.5 (`npm install -g graphcool-framework`)

> These are the currently known minimum version required. An earlier version may still work.

## 2/ Clone repository

Clone this repository

```bash
git clone https://github.com/Zenika/FAQ
```

## 3/ Install project dependencies

```bash
# Path: ./FAQ/
npm install

# Path: ./FAQ/server
npm install
```

## 4/ Create local graphcool instance

Run the following commands in order to create a local graphcool instance

```bash
# Path: ./FAQ/server
npm run graphcool local up
npm run graphcool deploy
```

When asked for information, answer with the following:

* Cluster: **local**
* Target name: **dev**
* Service name: **faq**

## 5/ Create your environment files

This project uses 2 `.env` file to configure its environment variables.

* The first `.env` file needs to be created at the root of the project.

* The second `.env` file needs to be created in the `server` folder.

Both files should have the following content:

```
REACT_APP_AUTH0_DOMAIN=zenika.eu.auth0.com
REACT_APP_AUTH0_CLIENTID=wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p

REACT_APP_GRAPHCOOL_URI=http://localhost:60000/simple/v1/{graphcool_id}
REACT_APP_GRAPHCOOL_URI_WS=http://localhost:60050/v1/{graphcool_id}
```

Where `{graphcool_id}` should be replaced with your own graphcool id found in the `./server/.graphcoolrc` file. (_It should look something like `cjdpzliff42pj01421oz29kwn`_)

## 6/ Re-deploy Graphcool

```bash
# Path: ./FAQ/server
npm run graphcool deploy
```

## 7/ Run the frontend

```bash
# Path: ./FAQ/
npm start
```

And you should now have an up and running FAQ!

But wait! It's only the slim version with only the required backing services. If you want more (e.g.: Algolia, Slack, Mailgun, ...), you will need to follow the [complete installation](/docs/installation.md) of the project.
