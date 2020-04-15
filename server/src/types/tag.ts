import { objectType } from 'nexus'

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()

    t.model.label()

    t.model.node()
    t.model.user()

    t.model.createdAt()
  }
})

export const TagLabel = objectType({
  name: 'TagLabel',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.tags()

    t.model.order()
    t.model.category()
  }
})

export const TagCategory = objectType({
  name: 'TagCategory',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.labels()

    t.model.order()
    t.model.configuration()
  }
})
