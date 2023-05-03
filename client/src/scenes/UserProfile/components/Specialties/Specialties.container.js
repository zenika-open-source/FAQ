import { withError } from 'components'
import { compose } from 'helpers'
import { query } from 'services/apollo'
import { GET_SPECALITIES } from './queries'

import Specialties from './Specialties'

export default compose(
  query(GET_SPECALITIES, {
    parse: ({ me = {} }) => ({
      spe: me.specalities
    })
  }),
  withError()
)(Specialties)
