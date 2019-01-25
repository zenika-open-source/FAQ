import { compose } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'

import { withLoading, withError } from 'components'

import { getNode } from './queries'
import Auth from 'services/auth'

export const withNode = compose(
  query(getNode, {
    skip: props => !props.match.params.slug,
    variables: props => ({ id: routing.getUIDFromSlug(props.match), locale: Auth.getLocale() })

  }),
withLoading(),
  withError()
)
