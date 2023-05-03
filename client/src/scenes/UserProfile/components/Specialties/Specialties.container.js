import { withError } from 'components'
import { compose } from 'helpers'
import { query } from 'services/apollo'
import { GET_SPECIALITIES } from './queries'

import Specialities from './Specialities'

export default compose(
  query(GET_SPECIALITIES, {
    parse: ({ me = {} }) => ({
      spe: me.specialities
    })
  }),
  withError()
)(Specialities)
