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
	mutation deleteFlag($id: ID!) {
		deleteFlag(id: $id) {
			id
		}
	}
`

const getFlags = async (graphcool, answer) => {
  return new Promise((resolve, reject) => {
    graphcool
      .request(getFlagsQuery, { answerId: answer.answerId })
      .then(data => {
        resolve(data.Answer.node.flags)
      })
  })
}

const deleteFlags = async (graphcool, answer) => {
  const flags = await getFlags(graphcool, answer)

  return Promise.all(
    flags.map(({ id }) => {
      return graphcool.request(deleteFlagQuery, { id })
    })
  )
}

export { deleteFlags }
