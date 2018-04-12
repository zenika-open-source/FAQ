# Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

First, clone the repository

```bash
# Path: ./
git clone https://github.com/Zenika/FAQ
```

Then, install the dependencies of the project (Front-end & Back-end)

```bash
# Path: ./FAQ/
npm install

cd server/
npm install
```

## Configuration

The app requires some environment variables to properly wire up to its backing services. See the [backing services documentation](/docs/backing_services.md) for more information on which environment variables you need.

You may define environment variables manually or you may use an `.env.local` file. This file is picked up by npm scripts. You can read an introduction to `.env` files [here](https://www.npmjs.com/package/dotenv). An `.env.local.example` file is provided with the project to initialize your own copy of `.env.local`.

**There is one file for the front-end at the root of the project and one for the back-end in `./server`.**

## Start

When your configuration is ready, deploy your back-end

```bash
# Path: ./FAQ/server
npm run deploy
```

Finally, start the application

```bash
# Path: ./FAQ/
npm start
```
