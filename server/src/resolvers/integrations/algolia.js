const algoliasearch = require('algoliasearch')

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY_ALL } = process.env

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
    label
  }
  flags {
    type
  }
}
`

class Algolia {
  constructor() {
    if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY_ALL) {
      // eslint-disable-next-line no-console
      console.log('Please provide the algolia app id and api key')
    }

    this.client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY_ALL)

    this.indices = []
  }
  getIndex(ctx) {
    const { name, stage } = ctx.prisma._meta.service

    if (this.indices[name] && this.indices[name][stage])
      return this.indices[name][stage]

    if (!this.indices[name]) this.indices[name] = []

    this.indices[name][stage] = this.client.initIndex(name + '_' + stage)

    return this.indices[name][stage]
  }
  async getNode(ctx, id) {
    const { tags, flags, ...node } = await ctx.prisma.query.zNode(
      { where: { id } },
      nodeQuery
    )

    return {
      ...node,
      tag: tags.map(t => t.label),
      flag: flags.map(f => f.type)
    }
  }
  async addNode(ctx, nodeId) {
    const node = await this.getNode(ctx, nodeId)
    this.getIndex(ctx).addObject(node)
  }
  async updateNode(ctx, nodeId) {
    const node = await this.getNode(ctx, nodeId)
    this.getIndex(ctx).saveObject(node)
  }
  removeNode(ctx, nodeId) {
    this.getIndex(ctx).deleteObject(nodeId)
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
    const content = await this.getIndex(ctx).search(params)

    const ids = content.hits.map(h => h.objectID)

    const highlights = content.hits.reduce((acc, h) => {
      const hl = h._highlightResult
      acc[h.objectID] = {
        question: hl.question && hl.question.title.value,
        answer: hl.answer && hl.answer.content.value
      }
      return acc
    }, {})

    return { ids, highlights, nbHits: content.nbHits }
  }
}

const algolia = new Algolia()

module.exports = algolia
