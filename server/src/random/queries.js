const countZNodesQuery = `
	query {
		_allZNodesMeta {
	    count
	  }
	}
`

const countUnansweredZNodesQuery = `
	query {
		_allZNodesMeta(filter:{answer:{id:null}}) {
	    count
	  }
	}
`

const countFlagsQuery = `
	query ($type: String!) {
		_allFlagsMeta(filter:{type:$type}) {
	    count
	  }
	}
`

const getZNodeQuery = `
	query ($index: Int!){
		allZNodes(skip:$index,first:1) {
	    id
	  }
	}
`

const getUnansweredZNodeQuery = `
	query ($index: Int!){
		allZNodes(skip:$index,first:1,filter:{answer:{id:null}}) {
			id
		}
	}
`

const getFlagQuery = `
	query ($index: Int!, $type: String!){
		allFlags(skip:$index,first:1,filter:{type:$type}) {
			node {
				id
			}
		}
	}
`

export const countZNodes = (graphcool, flag) => {
  if (flag) {
    if (flag === 'unanswered') {
      return graphcool
        .request(countUnansweredZNodesQuery)
        .then(data => data._allZNodesMeta.count)
    }

    return graphcool
      .request(countFlagsQuery, { type: flag })
      .then(data => data._allFlagsMeta.count)
  }

  return graphcool
    .request(countZNodesQuery)
    .then(data => data._allZNodesMeta.count)
}

export const getZNodeId = (graphcool, flag, index) => {
  if (flag) {
    if (flag === 'unanswered') {
      return graphcool
        .request(getUnansweredZNodeQuery, { index })
        .then(data => (data.allZNodes.length > 0 ? data.allZNodes[0].id : null))
    }

    return graphcool
      .request(getFlagQuery, { index, type: flag })
      .then(
        data => (data.allFlags.length > 0 ? data.allFlags[0].node.id : null)
      )
  }

  return graphcool
    .request(getZNodeQuery, { index })
    .then(data => (data.allZNodes.length > 0 ? data.allZNodes[0].id : null))
}
