import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { unserialize, addToQueryString } from 'helpers'

const withPagination = (options = { push: true }) => Component => {
  class withPaginationWrapper extends PureComponent {
    componentDidMount() {
      this.onMountOrUpdate()
    }
    componentDidUpdate() {
      this.onMountOrUpdate()
    }

    onMountOrUpdate = () => {
      const { history, location, loading, meta } = this.props

      const pagesCount = meta ? meta.pagesCount : 1
      const { page: currentPage } = unserialize(location.search)

      // If currentPage > pagesCount, redirect to last page
      if (!loading && pagesCount > 0 && currentPage > pagesCount) {
        addToQueryString(history, location, { page: pagesCount }, { push: options.push })
      }
    }

    render() {
      const { history, location, meta } = this.props

      const count = meta ? meta.entriesCount : 0
      const pagesCount = meta ? meta.pagesCount : 1
      const { page } = unserialize(location.search)

      return (
        <Component
          {...this.props}
          entriesCount={count}
          pageCurrent={page}
          pagesCount={pagesCount}
          onPageSelected={page =>
            addToQueryString(history, location, { page }, { push: options.push })
          }
        />
      )
    }
  }

  withPaginationWrapper.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    loading: PropTypes.bool,
    meta: PropTypes.object
  }

  return withPaginationWrapper
}

export default withPagination
