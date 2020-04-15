import algoliasearch, { SearchIndex } from 'algoliasearch'

import { Context } from '../../context'
import manager from '../manager'

class Algolia {
  indices: { [name: string]: SearchIndex } = {}

  getIndex(ctx: Context) {
    const { name } = ctx.prisma._meta

    const algoliaAppId = process.env.ALGOLIA_APP_ID
    const algoliaApiKey = process.env.ALGOLIA_API_KEY

    if (!algoliaAppId || !algoliaApiKey) {
      // eslint-disable-next-line no-console
      console.warn(`Please provide an algolia app id and an api key for tenant ${name}`)
      return null
    }

    if (this.indices[name] && this.indices[name]) {
      return this.indices[name]
    }

    this.indices[name] = algoliasearch(algoliaAppId, algoliaApiKey).initIndex(name)

    return this.indices[name]
  }
  async getNode(ctx: Context, id: string) {
    const node = await ctx.prisma.node.findOne({
      where: { id },
      include: { question: true, answer: true, tags: { include: { label: true } }, flags: true }
    })

    if (!node) return null

    return {
      objectID: node.id,
      question: {
        title: node.question.title,
        slug: node.question.slug
      },
      answer: node.answer ? { content: node.answer.content } : null,
      tag: node.tags.map(t => t.label.name),
      flag: node.flags.map(f => f.type)
    }
  }
  async upsertNode(ctx: Context, id: string) {
    const index = this.getIndex(ctx)

    if (index) {
      const node = await this.getNode(ctx, id)
      if (node) {
        index.saveObject(node)
      }
    }
  }
  removeNode(ctx: Context, id: string) {
    const index = this.getIndex(ctx)

    if (index) {
      index.deleteObject(id)
    }
  }
  search(
    ctx: Context,
    {
      text,
      tags = [],
      flags = [],
      first,
      skip
    }: { text: string; tags: string[]; flags: string[]; first: number; skip: number }
  ) {
    tags = tags.map(t => `tag:"${t}"`)
    flags = flags.map(f => `flag:"${f}"`)

    const filters = tags.concat(flags).join(' AND ')

    return this.query(ctx, text, {
      filters,
      offset: skip,
      length: first,
      advancedSyntax: true,
      removeWordsIfNoResults: 'allOptional'
    })
  }
  async query(ctx: Context, query: string, params: any) {
    const index = this.getIndex(ctx)

    if (!index) {
      return {
        ids: [],
        highlights: [],
        nbHits: 0
      }
    }

    const content = await index.search(query, params)

    const ids = content.hits.map(h => h.objectID)

    const highlights = content.hits.reduce((acc: any, h) => {
      // The following is a bug in the TS types of algoliasearch
      // @ts-ignore
      const hl = h._highlightResult
      acc[h.objectID] = {
        question: hl.question && hl.question.title.value,
        answer: hl.answer && hl.answer.content.value
      }
      return acc
    }, {})

    return { ids, highlights, hits: content.hits, nbHits: content.nbHits }
  }
  resyncSynonyms(ctx: Context, synonyms: any) {
    const index = this.getIndex(ctx)

    if (!index) return

    return index.saveSynonyms(synonyms, {
      forwardToReplicas: true,
      replaceExistingSynonyms: true
    })
  }
  async refreshTags(
    ctx: Context,
    { updated, deleted }: { updated: [string, string][]; deleted: string[] }
  ) {
    const index = this.getIndex(ctx)

    if (!index) return

    const tagsToQuery = deleted.concat(updated.map(([old]) => old))

    const hits = await this.browse(ctx, '', {
      filters: tagsToQuery.map(t => `tag:"${t}"`).join(' OR ')
    })

    const partialUpdates = hits.map(({ objectID, tag }) => {
      const newTags = tag
        .map(t => {
          if (!tagsToQuery.includes(t)) return t
          if (deleted.includes(t)) return null
          return (updated.find(([old]) => old === t) || [])[1]
        })
        .filter(t => t)

      return {
        objectID,
        tag: newTags
      }
    })

    return index.partialUpdateObjects(partialUpdates)
  }
  browse(ctx: Context, query: string, options: {}): Promise<{ objectID: string; tag: string[] }[]> {
    const index = this.getIndex(ctx)

    if (!index) return Promise.resolve([])

    return new Promise((resolve, reject) => {
      let hits: any = []
      index
        .browseObjects({
          query,
          ...options,
          batch: batch => (hits = hits.concat(batch))
        })
        .then(() => resolve(hits))
        .catch(reject)
    })
  }
}

const algolia = new Algolia()

/* Register hooks */

manager.register(
  [
    'question-created',
    'question-updated',
    'answer-created',
    'answer-updated',
    'flag-added',
    'flag-removed'
  ],
  (ctx, { nodeId }) => {
    algolia.upsertNode(ctx, nodeId)
  }
)

manager.register('configuration-updated', (ctx, { updates }) => {
  if (updates.algoliaSynonyms) {
    algolia.resyncSynonyms(ctx, JSON.parse(updates.algoliaSynonyms))
  }
})

manager.register('configuration-tags-updated', (ctx, { changes }) => {
  algolia.refreshTags(ctx, changes)
})

export default algolia
