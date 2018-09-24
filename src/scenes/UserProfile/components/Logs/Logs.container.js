import { withRouter } from 'react-router'

import { compose, unserialize } from 'helpers'
import { query } from 'services/apollo'
import { withError, withPagination } from 'components'

import { auth } from 'services'

import { meHistory } from './queries'

import Logs from './Logs'

const ENTRIES_PER_PAGE = 15

export default compose(
  withRouter,
  query(meHistory, {
    variables: props => {
      const { page } = unserialize(props.location.search)

      return {
        id: auth.getUserNodeId(),
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
