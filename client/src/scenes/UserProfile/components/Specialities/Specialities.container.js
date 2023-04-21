import { compose } from 'helpers'
import { query } from 'services/apollo'
import { withError } from 'components'
import { meSpecialities } from './queries'

import Specialities from './Specialities'

export default compose(
  query(meSpecialities, {
    variables: props => {
      return {
        id: props.userId
      }
    },
    parse: ({ spe = {} }) => ({
      specialities: spe.user
    })
  }),
  withError()
)(Specialities)
