import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import Home from 'scenes/Home'
import New from 'scenes/New'
import Question from 'scenes/Question'
import Answer from 'scenes/Answer'

class Root extends Component {
  render () {
    const { user } = this.props

    if (!user) return <div>Loading user...</div>

    return (
      <div
        style={{
          width: '70%',
          minWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/new" component={New} />
          <Route exact path="/q/:id" component={Question} />
          <Route path="/q/:id/answer" component={Answer} />
          <Route render={() => 404} />
        </Switch>
      </div>
    )
  }
}

Root.propTypes = {
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.data.user
})

export default connect(mapStateToProps)(Root)
