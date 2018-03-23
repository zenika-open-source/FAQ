import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Pluralize from 'react-pluralize'
import chunk from 'lodash/chunk'

import { routing } from 'services'

import Pagination from 'components/Pagination'

import Result from '../Result'

const ResultList = ({ nodes, indication, history, location, collapsed }) => {
  const maxNodesPerPage = 10

  const pagesCount = Math.ceil(nodes.length / maxNodesPerPage)

  let currentPage =
    Number.parseInt(routing.getQueryParam(location, 'page'), 10) || 1

  currentPage = Math.max(1, Math.min(currentPage, pagesCount))

  const Results = chunk(nodes, maxNodesPerPage)[currentPage - 1].map(node => {
    return (
      <Result
        collapsed={collapsed}
        node={node}
        key={node.id}
        style={{ marginBottom: '1rem' }}
      />
    )
  })

  return (
    <div style={{ marginTop: '1rem' }}>
      <p>
        <i>
          {indication || (
            <span>
              <Pluralize singular="result" count={nodes.length} /> found
            </span>
          )}
        </i>
      </p>
      {Results}
      <br />
      <Pagination
        pages={pagesCount}
        current={currentPage}
        onPageSelected={index => {
          routing.setQueryParam(location, history, 'page', index)
          window.scrollTo(0, 0)
        }}
      />
    </div>
  )
}

ResultList.propTypes = {
  nodes: PropTypes.array.isRequired,
  indication: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  collapsed: PropTypes.bool
}

export default withRouter(ResultList)
