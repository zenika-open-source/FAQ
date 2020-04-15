import differenceBy from 'lodash/differenceBy'

import { Context } from '../context'
import manager from '../integrations'

const diffTags = async (ctx: Context, tagCategories: string) => {
  const oldCats = await ctx.prisma.tagCategory.findMany({
    include: {
      labels: true
    }
  })
  const newCats = JSON.parse(tagCategories)

  const changes = []

  const algoliaChanges = {
    updated: [] as [string, string][],
    deleted: [] as string[]
  }

  // Categories (and and their labels) to create
  // Note: we do a batch create for the labels
  const catsToCreate = newCats.filter((c: any) => !c.id)
  changes.push(
    Promise.all(
      catsToCreate.map((cat: any) =>
        ctx.prisma.tagCategory.create({
          data: {
            name: cat.name,
            order: cat.order,
            labels: {
              create: cat.labels
            },
            configuration: {
              connect: { id: ctx.prisma._meta.configuration.id }
            }
          }
        })
      )
    )
  )

  // Categories to update
  // Note: we don't look at the changes in their labels, only the cat name and order
  const catsToUpdate = newCats
    .filter((c: any) => c.id)
    .filter((newCat: any) => {
      const oldCat: any = oldCats.find(c => c.id === newCat.id)
      return newCat.name !== oldCat.name || newCat.order !== oldCat.order
    })
  changes.push(
    Promise.all(
      catsToUpdate.map((cat: any) =>
        ctx.prisma.tagCategory.update({
          where: { id: cat.id },
          data: {
            name: cat.name,
            order: cat.order
          }
        })
      )
    )
  )

  // Categories (and their labels) to delete
  const catsToDelete = differenceBy(oldCats, newCats, 'id')
  const labelsFromCatsToDelete = catsToDelete.reduce((acc: any, cat) => acc.concat(cat.labels), [])
  algoliaChanges.deleted.push(
    ...catsToDelete.reduce((acc: string[], cat) => acc.concat(cat.labels.map(l => l.name)), [])
  )
  // TODO: Replace this with onDelete CASCADE
  changes.push(
    new Promise(async resolve => {
      // 1. Delete the tags
      await ctx.prisma.tag.deleteMany({
        where: {
          label: {
            id: { in: labelsFromCatsToDelete.map((label: any) => label.id) }
          }
        }
      })

      // 2. Delete the tagLabels
      await ctx.prisma.tagLabel.deleteMany({
        where: {
          id: { in: labelsFromCatsToDelete.map((label: any) => label.id) }
        }
      })

      // 3. Delete the categories
      await ctx.prisma.tagCategory.deleteMany({
        where: {
          id: { in: catsToDelete.map((cat: any) => cat.id) }
        }
      })

      resolve()
    })
  )

  // Labels to create
  // Note: we don't create thoses associated to new categories
  const labelsToCreate = newCats
    .filter((c: any) => c.id)
    .reduce(
      (acc: any, cat: any) =>
        acc.concat(
          cat.labels.filter((l: any) => !l.id).map((l: any) => ({ ...l, cat_id: cat.id }))
        ),
      []
    )
  // console.log('label create', labelsToCreate)
  changes.push(
    Promise.all(
      labelsToCreate.map((label: any) =>
        ctx.prisma.tagLabel.create({
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
    .filter((c: any) => c.id)
    .reduce(
      (acc: any, cat: any) =>
        acc.concat(
          cat.labels
            .filter((l: any) => l.id)
            .filter((newLabel: any) => {
              const oldLabel = oldCats
                .reduce((acc: any, cat: any) => acc.concat(cat.labels), [])
                .find((l: any) => l.id === newLabel.id)
              return newLabel.name !== oldLabel.name || newLabel.order !== oldLabel.order
            })
        ),
      []
    )
  algoliaChanges.updated = labelsToUpdate
    .map((newLabel: any) => {
      const oldLabel = oldCats
        .reduce((acc: any, cat) => acc.concat(cat.labels), [])
        .find((l: any) => l.id === newLabel.id)
      return [oldLabel.name, newLabel.name]
    })
    .filter(([a, b]: any) => a !== b)
  changes.push(
    Promise.all(
      labelsToUpdate.map((label: any) =>
        ctx.prisma.tagLabel.update({
          where: {
            id: label.id
          },
          data: {
            name: label.name,
            order: label.order
          }
        })
      )
    )
  )

  // Labels to delete
  const labelsToDelete = differenceBy(
    differenceBy(oldCats, catsToDelete, 'id').reduce((acc: any, cat) => acc.concat(cat.labels), []),
    newCats.reduce((acc: any, cat: any) => acc.concat(cat.labels), []),
    'id'
  )
  algoliaChanges.deleted.push(...labelsToDelete.map((l: any) => l.name))
  // TODO: Replace this with onDelete CASCADE
  changes.push(
    new Promise(async resolve => {
      // 1. Delete the tags
      await ctx.prisma.tag.deleteMany({
        where: {
          label: {
            id: { in: labelsToDelete.map((label: any) => label.id) }
          }
        }
      })

      // 2. Delete the tagLabels
      await ctx.prisma.tagLabel.deleteMany({
        where: {
          id: { in: labelsToDelete.map((label: any) => label.id) }
        }
      })

      resolve()
    })
  )

  await manager.trigger('configuration-tags-updated', ctx, { changes: algoliaChanges })

  return Promise.all(changes)
}

export default diffTags
