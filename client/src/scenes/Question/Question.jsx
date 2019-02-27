import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'

import { withNode } from './Question.container'

import Edit from './scenes/Edit'
import Read from './scenes/Read'
import Answer from './scenes/Answer'
import Random from './scenes/Random'

const withNodeRead = withNode(Read)
const withNodeEdit = withNode(Edit)
const withNodeAnswer = withNode(Answer)

const Question = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/new`} component={Edit} />
    <Route path={`${match.path}/random/:tag?`} component={Random} />
    <Route path={`${match.path}/:slug`} exact component={withNodeRead} />
    <Route path={`${match.path}/:slug/edit`} component={withNodeEdit} />
    <Route path={`${match.path}/:slug/answer`} component={withNodeAnswer} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

Question.propTypes = {
  match: PropTypes.object.isRequired
}

export default Question
