const { SchemaDirectiveVisitor } = require('graphql-tools')
const { defaultFieldResolver } = require('graphql')

class AdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = (...args) => {
      const [, , ctx] = args
      if (ctx.request.user.admin) {
        return resolve.apply(this, args)
      }

      throw new Error('You are not authorized to execute this operation.')
    }
  }
}

module.exports = AdminDirective
