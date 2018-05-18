const countZNodesQuery = `
	query {
		_allZNodesMeta {
	    count
	  }
	}
`

const countTagsQuery = `
	query ($label: String!) {
		_allTagsMeta(filter:{label:$label}) {
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

const getTagQuery = `
	query ($index: Int!, $label: String!){
		allTags(skip:$index,first:1,filter:{label:$label}) {
			node {
				id
			}
		}
	}
`

export const countZNodes = (graphcool, tag) => {
  if (tag) {
    return graphcool
      .request(countTagsQuery, { label: tag })
      .then(data => data._allTagsMeta.count)
  }

  return graphcool
    .request(countZNodesQuery)
    .then(data => data._allZNodesMeta.count)
}

export const getZNodeId = (graphcool, tag, index) => {
  if (tag) {
    return graphcool
      .request(getTagQuery, { index, label: tag })
      .then(data => (data.allTags.length > 0 ? data.allTags[0].node.id : null))
  }

  return graphcool
    .request(getZNodeQuery, { index })
    .then(data => (data.allZNodes.length > 0 ? data.allZNodes[0].id : null))
}
