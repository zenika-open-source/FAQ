# Transfer data from one service to another

## Steps:

- Place your `datamodel.graphql` and `prisma.yml` in this folder

```bash
node index.js --from=url_service_to_export_from --to=url_service_to_import_to
# Example:
node index.js --from=http://localhost:4466/default/default --to=http://localhost:4466/demo/dev
```

You need to set the following environment variables:

| name              | value                                    |
| ----------------- | ---------------------------------------- |
| PRISMA_API_SECRET | Prisma secret used for **both** services |
