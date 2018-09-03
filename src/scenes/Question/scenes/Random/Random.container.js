import { compose } from 'helpers'
import { withLoading, withError } from 'components'
import { query } from 'services/apollo'

import { getRandomNode } from './queries'

import Random from './Random'

export default compose(
  query(getRandomNode, {
    variables: props => ({
      tag: props.match.params.tag
    })
  }),
  withLoading('Unleashing the randomizator...'),
  withError()
)(Random)
