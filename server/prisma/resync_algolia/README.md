# Resync Algolia from Prisma

- Place your `datamodel.graphql` and `prisma.yml` in this folder

```bash
PRISMA_URL=the_url_with_service prisma export
```

- Manually unzip the export into `data/`

```bash
ALGOLIA_APP_ID=... ALGOLIA_API_KEY_ADMIN=... ALGOLIA_INDEX=...  node index.js
```
