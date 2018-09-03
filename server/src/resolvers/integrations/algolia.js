const algoliasearch = require('algoliasearch')

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY_ALL, ALGOLIA_INDEX } = process.env

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

    this.index = this.client.initIndex(ALGOLIA_INDEX)
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
    this.index.addObject(node)
  }
  async updateNode(ctx, nodeId) {
    const node = await this.getNode(ctx, nodeId)
    this.index.saveObject(node)
  }
  removeNode(ctx, nodeId) {
    this.index.deleteObject(nodeId)
  }
  search({ text, tags = [], flags = [], first, skip }) {
    tags = tags.map(t => `tag:"${t}"`)
    flags = flags.map(f => `flag:"${f}"`)

    const filters = tags.concat(flags).join(' AND ')

    return this.query({
      query: text,
      filters,
      offset: skip,
      length: first,
      advancedSyntax: true,
      removeWordsIfNoResults: 'allOptional'
    })
  }
  async query(params) {
    const content = await this.index.search(params)

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
