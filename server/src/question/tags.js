const _ = require('lodash')

const getTagsQuery = `
	query getTags($questionId: ID!) {
		Question(id: $questionId) {
			node {
				id
				tags {
					id
					label
				}
			}
		}
	}
`

const addTagQuery = `
	mutation addTag($label: String!, $nodeId: ID!, $userId: ID!) {
		createTag(label: $label, nodeId: $nodeId, userId: $userId) {
			id
		}
	}
`

const removeTagQuery = `
	mutation removeTag($id: ID!) {
		deleteTag(id: $id) {
			id
		}
	}
`

const getTags = (graphcool, question) => {
  return graphcool
    .request(getTagsQuery, { questionId: question.id })
    .then(data => data.Question.node)
}

const updateTags = async (graphcool, question) => {
  const newTags = question.tags
  const node = await getTags(graphcool, question)
  const oldTags = node.tags
  const oldTagsLabels = oldTags.map(tag => tag.label)

  const tagsToAdd = _.difference(newTags, oldTagsLabels)
  const tagsToRemove = _.difference(oldTagsLabels, newTags)

  const mutationsToAdd = tagsToAdd.map(tag => {
    return graphcool.request(addTagQuery, {
      label: tag,
      nodeId: node.id,
      userId: question.userId
    })
  })

  const mutationsToDelete = tagsToRemove.map(tag => {
    const id = _.find(oldTags, t => t.label === tag).id

    return graphcool.request(removeTagQuery, {
      id
    })
  })

  return Promise.all(_.concat(mutationsToAdd, mutationsToDelete))
}

export { updateTags }
