import React from 'react'

import { compose } from 'helpers'
import { routing } from 'services'
import { query } from 'services/apollo'

import { withLoading, withError } from 'components'

import { getNode } from './queries'
import Question from './Question'

const withNode = compose(
  query(getNode, {
    skip: props => !props.match.params.slug,
    variables: props => ({ id: routing.getUIDFromSlug(props.match) })
  }),
  withLoading(),
  withError()
)

const wrappedQuestion = props => <Question {...props} withNode={withNode} />

export default wrappedQuestion
