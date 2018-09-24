import { withRouter } from 'react-router'
import { compose, unserialize } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'
import { withError, withPagination } from 'components'

import { loadHistoryQuery } from './queries'

import HistoryActions from './HistoryActions'

const ENTRIES_PER_PAGE = 10

export default compose(
  withRouter,
  query(loadHistoryQuery, {
    variables: props => {
      const { page } = unserialize(props.location.search)
      return {
        nodeId: routing.getUIDFromSlug(props.match),
        first: ENTRIES_PER_PAGE,
        skip: ENTRIES_PER_PAGE * (page - 1)
      }
    },
    parse: ({ history = {} }) => ({ ...history })
  }),
  withPagination({ push: false }),
  withError()
)(HistoryActions)
