const fromEvent = require('graphcool-lib').fromEvent

const getFlagsQuery = `
	query getFlags($idAnswer: ID!) {
		Answer(id: $idAnswer) {
			node {
				flags {
					id
				}
			}
		}
	}
`

const deleteFlagQuery = `
	mutation deleteFlag($idFlag: ID!) {
		deleteFlag(id: $idFlag) {
			id
		}
	}
`

const getFlags = (graphcool, answer) => {
  return new Promise((resolve, reject) => {
    graphcool.request(getFlagsQuery, { idAnswer: answer.id }).then(data => {
      resolve(data.Answer.node.flags)
    })
  })
}

const deleteFlags = (graphcool, flags) => {
  const ids = flags.map(f => f.id)

  const mutations = ids.map(id => {
    return graphcool.request(deleteFlagQuery, { idFlag: id })
  })

  return Promise.all(mutations)
}

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const answer = event.data

  const flags = await getFlags(graphcool, answer)

  const deleted = await deleteFlags(graphcool, flags)

  return event
}
