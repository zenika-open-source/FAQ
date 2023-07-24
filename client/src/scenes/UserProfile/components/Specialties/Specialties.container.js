import { withError } from 'components'
import { compose } from 'helpers'
import { query } from 'services/apollo'
import { GET_SPECIALTIES } from './queries'

import Specialties from './Specialties'

export default compose(
  query(GET_SPECIALTIES, {
    parse: ({ me = {} }) => ({
      specialties: me.specialties,
    }),
  }),
  withError(),
)(Specialties)
