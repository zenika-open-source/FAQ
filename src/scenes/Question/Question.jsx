import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'

import Edit from './scenes/Edit'
import Read from './scenes/Read'
import Answer from './scenes/Answer'

const Question = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/new`} component={Edit} />
    <Route path={`${match.path}/:slug`} exact component={Read} />
    <Route path={`${match.path}/:slug/edit`} component={Edit} />
    <Route path={`${match.path}/:slug/answer`} component={Answer} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

Question.propTypes = {
  match: PropTypes.object.isRequired
}

export default Question
