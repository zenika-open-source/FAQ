import { compose } from '@helpers'
import { withLoading, withError } from '@components'
import { getIntl } from '@services'
import { query } from '@services/apollo'

import { GET_RANDOM } from './queries'

import Random from './Random'

export default compose(
  query(GET_RANDOM, {
    variables: props => ({
      tag: props.match.params.tag
    }),
    fetchPolicy: 'network-only'
  }),
  withLoading(getIntl(Random)('loading')),
  withError()
)(Random)
