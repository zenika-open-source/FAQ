import { withError, withPagination } from 'components'
import { compose, unserialize } from 'helpers'
import { query } from 'services/apollo'

import { SEARCH_NODES } from '../../queries'
import ResultList from './ResultList'
import { useLocation } from 'react-router'

const RESULTS_PER_PAGE = 10

export default compose(
  query(SEARCH_NODES, {
    variables: (props) => {
      const location = useLocation()
      const { tags, flags, page } = unserialize(location.search)
      return {
        text: props.searchText,
        tags,
        flags,
        first: RESULTS_PER_PAGE,
        skip: RESULTS_PER_PAGE * (page - 1),
      }
    },
    parse: ({ search = {} }) => ({ ...search }),
  }),
  withPagination(),
  withError(),
)(ResultList)
