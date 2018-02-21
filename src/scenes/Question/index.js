import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'

import New from './scenes/New'
import Read from './scenes/Read'
import Answer from './scenes/Answer'

class Question extends Component {
  render () {
    const prefix = this.props.match.path
    return (
      <Switch>
        <Route path={`${prefix}/new`} component={New} />
        <Route path={`${prefix}/:id`} exact component={Read} />
        <Route path={`${prefix}/:id/answer`} component={Answer} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    )
  }
}

Question.propTypes = {
  match: PropTypes.object.isRequired
}

export default Question
