import { compose } from 'helpers'
import { query } from 'services/apollo'
import { withLoading, withError } from 'components'

import { getAllPersonalData } from './queries'

import UserProfile from './UserProfile'

export default compose(
  query(getAllPersonalData),
  withLoading(),
  withError()
)(UserProfile)
