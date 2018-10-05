# Deploy to all Prisma services

## Steps:

- Place your `datamodel.graphql` and `prisma.yml` in this folder

```bash
PRISMA_URL=the_prisma_instance_url PRISMA_MANAGEMENT_API_SECRET=the_secret ALGOLIA_APP_ID=the_id ALGOLIA_API_KEY_ALL=the_key node index.js
```
