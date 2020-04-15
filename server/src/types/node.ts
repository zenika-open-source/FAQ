import { objectType, extendType, stringArg } from 'nexus'

export const Node = objectType({
  name: 'Node',
  definition(t) {
    t.model.id()

    t.model.question()
    t.model.answer()

    t.model.flags()
    t.model.tags()

    t.field('highlights', {
      type: 'Highlight',
      nullable: true
    })
  }
})

export const Highlight = objectType({
  name: 'Highlight',
  definition(t) {
    t.string('question', { nullable: true })
    t.string('answer', { nullable: true })
  }
})

export const GetNode = extendType({
  type: 'Query',
  definition(t) {
    t.field('node', {
      type: 'Node',
      args: { id: stringArg({ required: true }) },
      resolve: (root, { id }, ctx) => ctx.prisma.node.findOne({ where: { id } })
    })
  }
})
