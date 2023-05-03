const algoliasearch = require('algoliasearch')

// TMP_TAGS

const nodeQuery = `
{
  objectID: id
  question {
    title
    slug
  }
  answer {
    content
  }
  tags {
    label {
      name
    }
  }
  flags {
    type
  }
}
`

class Algolia {
  constructor() {
    this.indices = []
  }
  getIndex(ctx) {
    const {
      service: { name, stage },
      configuration: conf
    } = ctx.prisma._meta

    if (!conf.algoliaAppId || !conf.algoliaApiKey) {
      // eslint-disable-next-line no-console
      console.warn(`Please provide an algolia app id and an api key for service ${name}/${stage}`)
      return null
    }

    if (this.indices[name] && this.indices[name][stage]) {
      return this.indices[name][stage]
    }

    if (!this.indices[name]) this.indices[name] = []

    this.indices[name][stage] = algoliasearch(conf.algoliaAppId, conf.algoliaApiKey).initIndex(
      name + '_' + stage
    )

    return this.indices[name][stage]
  }
  async getNode(ctx, id) {
    const { tags, flags, ...node } = await ctx.prisma.query.zNode({ where: { id } }, nodeQuery)

    return {
      ...node,
      tag: tags.map(t => t.label.name),
      flag: flags.map(f => f.type)
    }
  }
  async addNode(ctx, nodeId) {
    const index = this.getIndex(ctx)

    if (index) {
      const node = await this.getNode(ctx, nodeId)
      index.addObject(node)
    }
  }
  async updateNode(ctx, nodeId) {
    const index = this.getIndex(ctx)

    if (index) {
      const node = await this.getNode(ctx, nodeId)
      index.saveObject(node)
    }
  }
  removeNode(ctx, nodeId) {
    const index = this.getIndex(ctx)

    if (index) {
      index.deleteObject(nodeId)
    }
  }
  search(ctx, { text, tags = [], flags = [], first, skip }) {
    tags = tags.map(t => `tag:"${t}"`)
    flags = flags.map(f => `flag:"${f}"`)

    const filters = tags.concat(flags).join(' AND ')

    return this.query(ctx, {
      query: text,
      filters,
      offset: skip,
      length: first,
      advancedSyntax: true,
      removeWordsIfNoResults: 'allOptional'
    })
  }
  async query(ctx, params) {
    const index = this.getIndex(ctx)

    if (!index) {
      return {
        ids: [],
        highlights: [],
        nbHits: 0
      }
    }

    const content = await index.search(params)

    const ids = content.hits.map(h => h.objectID)

    const highlights = content.hits.reduce((acc, h) => {
      const hl = h._highlightResult
      acc[h.objectID] = {
        question: hl.question && hl.question.title.value,
        answer: hl.answer && hl.answer.content.value
      }
      return acc
    }, {})

    return { ids, highlights, hits: content.hits, nbHits: content.nbHits }
  }
  resyncSynonyms(ctx, synonyms) {
    const index = this.getIndex(ctx)

    if (!index) return

    return new Promise((resolve, reject) => {
      index.batchSynonyms(
        synonyms,
        {
          forwardToReplicas: true,
          replaceExistingSynonyms: true
        },
        (err, content) => {
          if (err) return reject(err)
          resolve(content)
        }
      )
    })
  }
  async refreshTags(ctx, { updated, deleted }) {
    const index = this.getIndex(ctx)

    const tagsToQuery = deleted.concat(updated.map(([old]) => old))

    const hits = await this.browse(ctx, '', {
      filters: tagsToQuery.map(t => `tag:"${t}"`).join(' OR ')
    })

    const partialUpdates = hits.map(({ objectID, tag }) => {
      const newTags = tag
        .map(t => {
          if (!tagsToQuery.includes(t)) return t
          if (deleted.includes(t)) return null
          return updated.find(([old]) => old === t)[1]
        })
        .filter(t => t)

      return {
        objectID,
        tag: newTags
      }
    })

    return new Promise((resolve, reject) => {
      index.partialUpdateObjects(partialUpdates, (err, content) => {
        if (err) reject(err)
        resolve(content)
      })
    })
  }
  browse(ctx, query, options) {
    const index = this.getIndex(ctx)

    return new Promise((resolve, reject) => {
      const browser = index.browseAll(query, options)
      let hits = []

      browser.on('result', content => {
        hits = hits.concat(content.hits)
      })

      browser.on('end', () => resolve(hits))

      browser.on('error', reject)
    })
  }
  clearIndex(ctx) {
    const index = this.getIndex(ctx)
    index.clearIndex()
  }
}

const algolia = new Algolia()

module.exports = algolia
