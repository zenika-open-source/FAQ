import { compose } from 'helpers'
import { query } from 'services/apollo'
import { withLoading, withError } from 'components'

import { me } from './queries'

import UserProfile from './UserProfile'

export default compose(
  query(me),
  withLoading(),
  withError()
)(UserProfile)
