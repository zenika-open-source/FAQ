import { compose } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'

import { withError } from 'components'

import { getNode } from './queries'

export const withNode = compose(
  query(getNode, {
    skip: props => !props.match.params.slug,
    variables: props => ({ id: routing.getUIDFromSlug(props.match) })
  }),
  withError()
)
