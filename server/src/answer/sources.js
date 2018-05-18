const _ = require('lodash')

const getSourcesQuery = `
	query getSources($answerId: ID!) {
		Answer(id: $answerId) {
			sources {
				id
				label
				url
			}
		}
	}
`

const addSourceQuery = `
	mutation createSource($answerId: ID!, $label: String!, $url: String!) {
		createSource(answerId: $answerId, label: $label, url: $url) {
			id
		}
	}
`

const updateSourceQuery = `
	mutation updateSource($sourceId: ID!, $label: String!, $url: String!) {
		updateSource(id: $sourceId, label: $label, url: $url) {
			id
		}
	}
`

const deleteSourceQuery = `
	mutation deleteSource($sourceId: ID!) {
		deleteSource(id: $sourceId) {
			id
		}
	}
`

const getSources = (graphcool, answer) => {
  return new Promise((resolve, reject) => {
    graphcool
      .request(getSourcesQuery, { answerId: answer.answerId })
      .then(data => {
        resolve(data.Answer.sources)
      })
  })
}

const updateSources = async (graphcool, answer) => {
  const newSources = JSON.parse(answer.sources)
  const oldSources = await getSources(graphcool, answer)

  const sourcesToAdd = _.differenceBy(newSources, oldSources, 'id')
  const sourcesToUpdate = _.differenceBy(newSources, sourcesToAdd)
  const sourcesToDelete = _.differenceBy(oldSources, newSources, 'id')

  const mutationsToAdd = sourcesToAdd.map(source => {
    return graphcool.request(addSourceQuery, {
      answerId: answer.answerId,
      label: source.label,
      url: source.url
    })
  })

  const mutationsToUpdate = sourcesToUpdate.map(source => {
    return graphcool.request(updateSourceQuery, {
      sourceId: source.id,
      label: source.label,
      url: source.url
    })
  })

  const mutationsToDelete = sourcesToDelete.map(source => {
    return graphcool.request(deleteSourceQuery, { sourceId: source.id })
  })

  await Promise.all(
    _.concat(mutationsToAdd, mutationsToUpdate, mutationsToDelete)
  )

  const clean = sources => sources.map(s => ({ label: s.label, url: s.url }))

  return {
    added: clean(sourcesToAdd),
    updated: clean(sourcesToUpdate),
    deleted: clean(sourcesToDelete)
  }
}

export { updateSources }
