import { withRouter } from 'react-router'
import { compose } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'
import { withLoading, withError } from 'components'

import { loadHistoryQuery } from './queries'

import HistoryActions from './HistoryActions'

export default compose(
  withRouter,
  query(loadHistoryQuery, {
    variables: props => ({ nodeId: routing.getUIDFromSlug(props.match) })
  }),
  withLoading(),
  withError()
)(HistoryActions)
