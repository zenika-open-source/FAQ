import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Pluralize from 'react-pluralize'
import _ from 'lodash'

import { routing } from 'services'

import Pagination from 'components/Pagination'

import NodeCard from '../NodeCard'

class ResultList extends Component {
  render () {
    const { nodes, indication, history, location } = this.props

    const maxNodesPerPage = 10

    const pagesCount = Math.ceil(nodes.length / maxNodesPerPage)

    let currentPage =
      Number.parseInt(routing.getQueryParam(location, 'page'), 10) || 1

    currentPage = Math.max(1, Math.min(currentPage, pagesCount))

    const NodeCards = _.chunk(nodes, maxNodesPerPage)[currentPage - 1].map(
      node => {
        return (
          <NodeCard
            node={node}
            key={node.id}
            style={{ marginBottom: '1rem' }}
          />
        )
      }
    )

    return (
      <div>
        <p className="indication">
          {indication || (
            <span>
              <Pluralize singular="result" count={nodes.length} /> found
            </span>
          )}
        </p>
        {NodeCards}
        <Pagination
          pages={pagesCount}
          current={currentPage}
          onPageSelected={index => {
            routing.setQueryParam(location, history, 'page', index)
          }}
        />
      </div>
    )
  }
}

ResultList.propTypes = {
  nodes: PropTypes.array.isRequired,
  indication: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(ResultList)
