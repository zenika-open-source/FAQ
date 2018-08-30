const algoliasearch = require('algoliasearch')

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
    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY_ALL) {
      // eslint-disable-next-line no-console
      console.log('Please provide the algolia app id and api key')
    }

    this.client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY_ALL
    )

    this.index = this.client.initIndex('dev_Nodes')
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
}

const algolia = new Algolia()

module.exports = algolia
