import { compose } from 'helpers'
import { query } from 'services/apollo'
import { withError, withLoading } from 'components'
import { GET_SPECIALITIES } from './queries'

import Specialities from './Specialities'

export default compose(query(GET_SPECIALITIES), withLoading(), withError())(Specialities)
