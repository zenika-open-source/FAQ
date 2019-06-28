import { compose } from 'helpers'
import { withLoading, withError } from 'components'
import { useIntl } from 'services'
import { query } from 'services/apollo'

import { getRandomNode } from './queries'

import Random from './Random'

export default compose(
  query(getRandomNode, {
    variables: props => ({
      tag: props.match.params.tag
    })
  }),
  withLoading(useIntl(Random)('loading')),
  withError()
)(Random)
