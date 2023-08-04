import { compose } from 'helpers'
import { withLoading, withError } from 'components'
import { getIntl } from 'services'
import { query } from 'services/apollo'

import { GET_RANDOM } from './queries'

import Random from './Random'
import { useParams } from 'react-router'

export default compose(
  query(GET_RANDOM, {
    variables: () => {
      const params = useParams()
      return {
        tag: params.tag
      }
    },
    fetchPolicy: 'network-only',
  }),
  withLoading(getIntl(Random)('loading')),
  withError(),
)(Random)
