import { compose } from 'helpers'
import { query } from 'services/apollo'

import { withLoading, withError } from 'components'

import { me } from './queries'
import UserMenu from './UserMenu'

export default compose(
  query(me),
  withLoading(false),
  withError()
)(UserMenu)
