import { withError, withPagination } from 'components'
import { compose, unserialize } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'

import { LOAD_HISTORY } from './queries'

import HistoryActions from './HistoryActions'
import { useLocation, useParams } from 'react-router'

const ENTRIES_PER_PAGE = 10

export default compose(
  query(LOAD_HISTORY, {
    variables: () => {
      const location = useLocation()
      const params = useParams()
      const { page } = unserialize(location.search)
      return {
        nodeId: routing.getUIDFromSlug(params),
        first: ENTRIES_PER_PAGE,
        skip: ENTRIES_PER_PAGE * (page - 1),
      }
    },
    parse: ({ history = {} }) => ({ ...history }),
  }),
  withPagination({ push: false }),
  withError(),
)(HistoryActions)
