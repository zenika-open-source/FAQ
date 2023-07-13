import { withError, withPagination } from 'components'
import { compose, unserialize } from 'helpers'
import { query } from 'services/apollo'

import { meHistory } from './queries'

import { useNavigate } from 'react-router'
import Logs from './Logs'

const ENTRIES_PER_PAGE = 15

export default compose(
  query(meHistory, {
    variables: props => {
      const navigate = useNavigate()
      const { page } = unserialize(props.location.search)

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
