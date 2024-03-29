import PropTypes from 'prop-types'
import { useEffect } from 'react'

import { addToQueryString, unserialize } from 'helpers'
import { useLocation } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const withPagination =
  (options = { push: true }) =>
  (Component) => {
    const withPaginationWrapper = (props) => {
      const location = useLocation()
      const [, setSearchParams] = useSearchParams()
      const { loading, meta } = props

      const onMountOrUpdate = () => {
        const pagesCount = meta ? meta.pagesCount : 1
        const { page: currentPage } = unserialize(location.search)

        // If currentPage > pagesCount, redirect to last page
        if (!loading && pagesCount > 0 && currentPage > pagesCount) {
          addToQueryString(setSearchParams, location, { page: pagesCount }, { push: options.push })
        }
      }

      useEffect(() => {
        onMountOrUpdate()
      }, [location.search])

      const count = meta ? meta.entriesCount : 0
      const pagesCount = meta ? meta.pagesCount : 1
      const { page } = unserialize(location.search)

      return (
        <Component
          {...props}
          entriesCount={count}
          pageCurrent={page}
          pagesCount={pagesCount}
          onPageSelected={(page) =>
            addToQueryString(setSearchParams, location, { page }, { push: options.push })
          }
        />
      )
    }

    withPaginationWrapper.propTypes = {
      location: PropTypes.object,
      loading: PropTypes.bool,
      meta: PropTypes.object,
    }

    return withPaginationWrapper
  }

export default withPagination
