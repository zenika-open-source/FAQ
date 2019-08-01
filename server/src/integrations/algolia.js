const algoliasearch = require('algoliasearch')

class Algolia {
  constructor() {
    this.indices = []
  }
  getIndex(ctx) {
    const { name, configuration: conf } = ctx.photon._meta

    if (!conf.algoliaAppId || !conf.algoliaApiKey) {
      // eslint-disable-next-line no-console
      console.warn(`Please provide an algolia app id and an api key for service ${name}`)
      return null
    }

    if (this.indices[name]) {
      return this.indices[name]
    }

    this.indices[name] = algoliasearch(conf.algoliaAppId, conf.algoliaApiKey).initIndex(
      name.replace(/\$/g, '_')
    )

    return this.indices[name]
  }
  async getNode(ctx, id) {
    const { tags, flags, ...node } = await ctx.photon.nodes.findOne({
      where: { id },
      include: { question: true, answer: true, tags: true, flags: true }
    })

    return {
      objectID: id,
      ...node,
      tag: tags.map(t => t.label),
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
}

const algolia = new Algolia()

module.exports = algolia
