import { compose } from 'helpers'

import { withLoading } from 'components'

import { query } from 'services/apollo'

import { GET_CONFIGURATION } from './queries'

import Settings from './Settings'

export default compose(query(GET_CONFIGURATION), withLoading())(Settings)
