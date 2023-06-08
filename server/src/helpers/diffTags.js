const differenceBy = require('lodash/differenceBy')

const algolia = require('../integrations/algolia')

const diffTags = (ctx, oldCats, newCats, confId) => {
  const promises = []

  const algoliaChanges = {
    updated: [],
    deleted: []
  }

  // Categories (and labels) to create
  // Note: we do a batch create for the labels
  const catsToCreate = newCats.filter(c => !c.id)
  promises.push(
    Promise.all(
      catsToCreate.map(cat =>
        ctx.prisma.mutation.createSubjectCategory({
          data: {
            name: cat.name,
            order: cat.order,
            labels: {
              create: cat.labels
            },
            configuration: {
              connect: { id: confId }
            }
          }
        })
      )
    )
  )

  // Categories to update
  // Note: we don't care if there was changes in their labels
  const catsToUpdate = newCats
    .filter(c => c.id)
    .filter(newCat => {
      const oldCat = oldCats.find(c => c.id === newCat.id)
      return newCat.name !== oldCat.name || newCat.order !== oldCat.order
    })
  promises.push(
    Promise.all(
      catsToUpdate.map(cat =>
        ctx.prisma.mutation.updateSubjectCategory({
          where: {
            id: cat.id
          },
          data: {
            name: cat.name,
            order: cat.order
          }
        })
      )
    )
  )

  // Categories (and labels) to delete
  // Note: the associated labels will be deleted because of "onDelete: CASCADE"
  const catsToDelete = differenceBy(oldCats, newCats, 'id')
  algoliaChanges.deleted.push(
    ...catsToDelete.reduce((acc, cat) => acc.concat(cat.labels.map(l => l.name)), [])
  )
  promises.push(
    Promise.all(
      catsToDelete.map(cat =>
        ctx.prisma.mutation.deleteSubjectCategory({
          where: { id: cat.id }
        })
      )
    )
  )

  // Labels to create
  // Note: we don't create thoses associated to new categories
  const labelsToCreate = newCats
    .filter(c => c.id)
    .reduce(
      (acc, cat) => acc.concat(cat.labels.filter(l => !l.id).map(l => ({ ...l, cat_id: cat.id }))),
      []
    )
  promises.push(
    Promise.all(
      labelsToCreate.map(label =>
        ctx.prisma.mutation.createSubject({
          data: {
            name: label.name,
            order: label.order,
            category: { connect: { id: label.cat_id } }
          }
        })
      )
    )
  )

  // Labels to update
  const labelsToUpdate = newCats
    .filter(c => c.id)
    .reduce(
      (acc, cat) =>
        acc.concat(
          cat.labels
            .filter(l => l.id)
            .filter(newLabel => {
              const oldLabel = oldCats
                .reduce((acc, cat) => acc.concat(cat.labels), [])
                .find(l => l.id === newLabel.id)
              return newLabel.name !== oldLabel.name || newLabel.order !== oldLabel.order
            })
        ),
      []
    )
  algoliaChanges.updated = labelsToUpdate
    .map(newLabel => {
      const oldLabel = oldCats
        .reduce((acc, cat) => acc.concat(cat.labels), [])
        .find(l => l.id === newLabel.id)
      return [oldLabel.name, newLabel.name]
    })
    .filter(([a, b]) => a !== b)

  promises.push(
    Promise.all(
      labelsToUpdate.map(label =>
        ctx.prisma.mutation.updateSubject({
          where: { id: label.id },
          data: { name: label.name, order: label.order }
        })
      )
    )
  )

  // Labels to delete
  // Note: the associated tags will be deleted because of "onDelete: CASCADE"
  const labelsToDelete = differenceBy(
    differenceBy(oldCats, catsToDelete, 'id').reduce((acc, cat) => acc.concat(cat.labels), []),
    newCats.reduce((acc, cat) => acc.concat(cat.labels), []),
    'id'
  )
  algoliaChanges.deleted.push(...labelsToDelete.map(l => l.name))
  promises.push(
    Promise.all(
      labelsToDelete.map(label => ctx.prisma.mutation.deleteSubject({ where: { id: label.id } }))
    )
  )

  algolia.refreshTags(ctx, algoliaChanges)

  return Promise.all(promises)
}

module.exports = diffTags
