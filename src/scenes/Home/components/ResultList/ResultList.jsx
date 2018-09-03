import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Pluralize from 'react-pluralize'

import { routing } from 'services'
import { unserialize, addToQueryString } from 'helpers'

import { Loading, Pagination } from 'components'

import NoResults from '../NoResults'
import Result from '../Result'

class ResultList extends PureComponent {
  componentDidMount() {
    this.onMountOrUpdate()
  }
  componentDidUpdate() {
    this.onMountOrUpdate()
  }

  onMountOrUpdate = () => {
    const {
      history,
      location,
      loading,
      search: { meta }
    } = this.props

    const pagesCount = Math.ceil(meta.count / meta.resultsPerPage)
    const currentPage = unserialize(location.search).page

    this.props.setSearchLoading(loading)

    // If currentPage > pagesCount, redirect to last page
    if (!loading && pagesCount !== 0 && currentPage > pagesCount) {
      addToQueryString(history, location, { page: pagesCount })
    }
  }

  render() {
    const { searchText, search, location, history, loading } = this.props

    const { nodes, meta } = search

    if (!loading && nodes.length === 0) {
      return <NoResults prefill={searchText} />
    }

    const pagesCount = Math.ceil(meta.count / meta.resultsPerPage)
    const { page: currentPage } = unserialize(location.search)

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
        {!loading && (
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
                  <Pluralize singular="result" count={meta.count} /> found
                </span>
              ) : (
                'Latest questions'
              )}
            </i>
            <i>Page {currentPage}</i>
          </p>
        )}
        {!loading ? Results : <Loading />}
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
}

ResultList.propTypes = {
  search: PropTypes.object,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  setSearchLoading: PropTypes.func.isRequired,
  searchText: PropTypes.string
}

ResultList.defaultProps = {
  search: { nodes: [], meta: { count: 0, resultsPerPage: 1 } }
}

export default ResultList
