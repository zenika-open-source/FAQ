# Multi-tenancy

FAQ is a [multi-tenancy](https://en.wikipedia.org/wiki/Multitenancy) application. You can have multiple services served with only instance of the stack (Frontend / Backend / Prisma / DB).

If you do not specify a service during the installation, you will have a default service name and stage (default/default).

## How to create a new service

Execute the following command:

```bash
# Path: ./FAQ/server/
AUTH0_DOMAIN=your_domain AUTH0_CLIENT_ID=your_client_id SERVICE_NAME=the_service_name SERVICE_STAGE=the_service_stage npm run new_service
```

You now have a new service!

> For the complete configuration of your service, see the [configuration documentation](/docs/configuration.md). Don't forget to redeploy and restart the server after you changed the configuration!

## Service routing in production

While in production, the service accessed will depend on the url you are at:

```
https://[service_stage?].[service_name?].[FAQ_URL]/
```

| name          | value                                       |
| ------------- | ------------------------------------------- |
| FAQ_URL       | Provided from environment variables         |
| service_name  | The name of the service. Default: `default` |
| service_stage | The stage of the service. Default: `prod`   |

Examples with FAQ_URL=faq.zenika.com (`name / stage`):

- faq.zenika.com => `default / prod`
- demo.faq.zenika.com => `demo / prod`
- dev.demo.faq.zenika.com => `demo / dev`

> Note 1: If NODE_ENV!=production or if no FAQ_URL is found in your frontend environment variables, the default routing will return `default/default`

> Note 2: The routing can be overrided using REACT_APP_PRISMA_SERVICE=name/stage in your frontend
