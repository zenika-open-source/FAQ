import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'

import Read from './scenes/Read'
import Edit from './scenes/Edit'
import Answer from './scenes/Answer'

class Question extends Component {
  render () {
    const prefix = this.props.match.path
    return (
      <Switch>
        <Route path={`${prefix}/new`} component={Edit} />
        <Route path={`${prefix}/:slug`} exact component={Read} />
        <Route path={`${prefix}/:slug/edit`} component={Edit} />
        <Route path={`${prefix}/:slug/answer`} component={Answer} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    )
  }
}

Question.propTypes = {
  match: PropTypes.object.isRequired
}

export default Question
