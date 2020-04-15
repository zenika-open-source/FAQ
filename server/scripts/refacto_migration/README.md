# Refacto migration

Everything that needs to be done to migrate old tenants to new tenants:

- Make backups
- Export data
- Transform to the new datamodel
- Push data into the new pgsql schemas
- Create the tenants in management
- Resynchronize Algolia
