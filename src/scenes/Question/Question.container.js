import React from 'react'
import { query } from 'services/apollo'

import { routing } from 'services'

import { getNode } from './queries'
import Question from './Question'

const withNode = query(getNode, {
  skip: props => !props.match.params.slug,
  variables: props => ({ id: routing.getUIDFromSlug(props.match) })
})

const wrappedQuestion = props => <Question {...props} withNode={withNode} />

export default wrappedQuestion
