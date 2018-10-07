# Migration from Graphcool to Prisma

## Issues:

The flags "unanswered" were not stored in the DB in graphcool, but they are now stored in Prisma.
This script forgot to add theses flags into Prisma. (See issue #96)

## Steps:

- Place your `datamodel.graphql` and `prisma.yml` in this folder
- Set the correct URL and TOKEN in `export.sh`
- Set the correct URL in `prisma.yml`

```bash
bash export.sh
node transform.js
PRISMA_MANAGEMENT_API_SECRET=the_secret bash import.sh
```

> Be sure to have an empty DB

```graphql
mutation {
  deleteManyHistoryActions {
    count
  }
  deleteManyTags {
    count
  }
  deleteManyFlags {
    count
  }
  deleteManySources {
    count
  }
  deleteManyAnswers {
    count
  }
  deleteManyQuestions {
    count
  }
  deleteManyZNodes {
    count
  }
  deleteManyUsers {
    count
  }
}
```
