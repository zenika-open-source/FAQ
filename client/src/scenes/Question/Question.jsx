import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Answer, Create, Read, Update, Random } from './scenes'

const Question = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/new`} component={Create} />
    <Route path={`${match.path}/random`} component={Random} />
    <Route path={`${match.path}/:slugid`} exact component={Read} />
    <Route path={`${match.path}/:slugid/edit`} component={Update} />
    <Route path={`${match.path}/:slugid/answer`} component={Answer} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
)

export default Question
