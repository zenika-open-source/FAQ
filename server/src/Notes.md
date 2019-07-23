Limitations:

- We can't seed using `prisma2 seed`, but we can `node prisma/seed.js`
- There is no `aggregation` available, so we findMany() and get length
- JSON is not supported yet, so we manually serialize/deserialize it for now
- We cannot create a nested create/connect, so we make multiple small operations
- We cannot create with empty data && createdAt, so we use a dummy attribute
- We cannot update with null values, so we use 'null' strings
