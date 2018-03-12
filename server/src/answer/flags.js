const getFlagsQuery = `
	query getFlags($answerId: ID!) {
		Answer(id: $answerId) {
			node {
				flags {
					id
				}
			}
		}
	}
`

const deleteFlagQuery = `
	mutation deleteFlag($flagId: ID!) {
		deleteFlag(id: $flagId) {
			id
		}
	}
`

const getFlags = (graphcool, answer) => {
  return new Promise((resolve, reject) => {
    graphcool
      .request(getFlagsQuery, { answerId: answer.answerId })
      .then(data => {
        resolve(data.Answer.node.flags)
      })
  })
}

const deleteFlags = (graphcool, answer) => {
  return new Promise(resolve => {
    getFlags(graphcool, answer).then(flags => {
      const ids = flags.map(f => f.id)

      const mutations = ids.map(id => {
        return graphcool.request(deleteFlagQuery, { flagId: id })
      })

      Promise.all(mutations).then(resolve)
    })
  })
}

export { deleteFlags }
