FROM prismagraphql/prisma:1.20.0

ARG POSTGRESQL_ADDON_DB
ARG POSTGRESQL_ADDON_HOST
ARG POSTGRESQL_ADDON_PASSWORD
ARG POSTGRESQL_ADDON_PORT
ARG POSTGRESQL_ADDON_USER
ARG MANAGEMENT_API_SECRET

ENV PRISMA_CONFIG {port: 8080, managementApiSecret: "$MANAGEMENT_API_SECRET", databases: {default: {connector: postgres, database: "$POSTGRESQL_ADDON_DB", host: "$POSTGRESQL_ADDON_HOST", port: "$POSTGRESQL_ADDON_PORT", user: "$POSTGRESQL_ADDON_USER", password: "$POSTGRESQL_ADDON_PASSWORD", migrations: true, ssl: false}}}

RUN apk add postgresql-client

ENTRYPOINT PGPASSWORD=$POSTGRESQL_ADDON_PASSWORD psql -d $POSTGRESQL_ADDON_DB -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -W -c "select pg_terminate_backend(locks.pid) from (select pid from pg_locks where locktype = 'advisory' and objid = 1000 and granted = true) as locks" && /app/start.sh