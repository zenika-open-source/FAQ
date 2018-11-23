import { compose } from 'helpers'
import { query } from 'services/apollo'
import { withLoading, withError } from 'components'

import { getConfiguration, updateConfiguration } from './queries'

import Settings from './Settings'

export default compose(
  query(getConfiguration),
  withLoading(),
  withError(),
  updateConfiguration
)(Settings)
