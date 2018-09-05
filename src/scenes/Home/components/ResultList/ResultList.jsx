import React from 'react'
import PropTypes from 'prop-types'
import Pluralize from 'react-pluralize'

import { Loading } from 'components'
import { DefaultPagination } from 'components/Pagination'

import NoResults from '../NoResults'
import Result from '../Result'

const ResultList = ({
  searchText,
  nodes = [],
  loading,
  entriesCount,
  pagesCount,
  pageCurrent,
  onPageSelected,
  meta
}) => {
  const shouldShowLoading =
    loading && (meta ? meta.pageCurrent !== pageCurrent : true)

  if (!loading && nodes.length === 0) {
    return <NoResults prefill={searchText} />
  }

  const Results = nodes.map(node => {
    return (
      <Result
        key={node.id}
        collapsed={!searchText}
        node={node}
        style={{ marginBottom: '1rem' }}
      />
    )
  })

  return (
    <div style={{ marginTop: '1rem' }}>
      {!shouldShowLoading && (
        <p
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 1rem'
          }}
        >
          <i>
            {searchText ? (
              <span>
                <Pluralize singular="result" count={entriesCount} /> found
              </span>
            ) : (
              'Latest questions'
            )}
          </i>
          <i>Page {pageCurrent}</i>
        </p>
      )}
      {!shouldShowLoading ? Results : <Loading />}
      <br />
      <DefaultPagination
        nbPages={pagesCount}
        current={pageCurrent}
        onPageSelected={index => {
          onPageSelected(index)
          window.scrollTo(0, 0)
        }}
      />
    </div>
  )
}

ResultList.propTypes = {
  searchText: PropTypes.string,
  nodes: PropTypes.array,
  loading: PropTypes.bool,
  entriesCount: PropTypes.number,
  pagesCount: PropTypes.number,
  pageCurrent: PropTypes.number,
  onPageSelected: PropTypes.func,
  meta: PropTypes.object
}

export default ResultList
