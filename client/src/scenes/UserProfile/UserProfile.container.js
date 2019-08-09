import { compose } from 'helpers'
import { query } from 'services/apollo'
import { withLoading, withError } from 'components'

import { GET_ME } from './queries'

import UserProfile from './UserProfile'

export default compose(
  query(GET_ME),
  withLoading(),
  withError()
)(UserProfile)
