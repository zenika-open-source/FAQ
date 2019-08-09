import { withRouter } from 'react-router'

import { compose, unserialize } from 'helpers'
import { query } from 'services/apollo'
import { withError, withPagination } from 'components'

import { SEARCH_NODES } from '../../queries'
import ResultList from './ResultList'

const RESULTS_PER_PAGE = 10

export default compose(
  withRouter,
  query(SEARCH_NODES, {
    variables: props => {
      const { tags, flags, page } = unserialize(props.location.search)

      return {
        text: props.searchText,
        tags,
        flags,
        first: RESULTS_PER_PAGE,
        skip: RESULTS_PER_PAGE * (page - 1)
      }
    },
    parse: ({ search = {} }) => ({ ...search })
  }),
  withPagination(),
  withError()
)(ResultList)
