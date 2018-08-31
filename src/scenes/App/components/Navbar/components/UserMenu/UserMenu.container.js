import { query } from 'services/apollo'

import { me } from './queries'
import UserMenu from './UserMenu'

export default query(me, { silent: true })(UserMenu)
