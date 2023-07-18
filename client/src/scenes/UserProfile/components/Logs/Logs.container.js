import { withError, withPagination } from 'components'
import { compose, unserialize } from 'helpers'
import { useLocation } from 'react-router'
import { query } from 'services/apollo'

import Logs from './Logs'
import { meHistory } from './queries'

const ENTRIES_PER_PAGE = 15

export default compose(
  query(meHistory, {
    variables: props => {
      const location = useLocation()
      const { page } = unserialize(location.search)

      return {
        id: props.userId,
        first: ENTRIES_PER_PAGE,
        skip: ENTRIES_PER_PAGE * (page - 1)
      }
    },
    parse: ({ history = {} }) => ({
      logs: history.historyActions,
      meta: history.meta
    })
  }),
  withPagination({ push: false }),
  withError()
)(Logs)
