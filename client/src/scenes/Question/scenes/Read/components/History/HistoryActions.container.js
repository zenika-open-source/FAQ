import { withError, withPagination } from 'components'
import { compose, unserialize } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'

import { LOAD_HISTORY } from './queries'

import { useNavigate } from 'react-router'
import HistoryActions from './HistoryActions'

const ENTRIES_PER_PAGE = 10

export default compose(
  query(LOAD_HISTORY, {
    variables: props => {
      const navigate = useNavigate()
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
