import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'

import Edit from './scenes/Edit'
import Read from './scenes/Read'
import Answer from './scenes/Answer'

import { getNode } from './queries'

const Question = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/new`} component={Edit} />
    <Route path={`${match.path}/:slug`} exact component={getNode(Read)} />
    <Route path={`${match.path}/:slug/edit`} component={getNode(Edit)} />
    <Route path={`${match.path}/:slug/answer`} component={getNode(Answer)} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

Question.propTypes = {
  match: PropTypes.object.isRequired
}

export default Question
