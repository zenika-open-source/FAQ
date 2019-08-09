import { query } from 'services/apollo'

import { GET_CONFIGURATION } from './queries'

import Settings from './Settings'

export default query(GET_CONFIGURATION)(Settings)
