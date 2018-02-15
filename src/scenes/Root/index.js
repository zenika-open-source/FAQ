import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import Home from 'scenes/Home'
import New from 'scenes/New'

class Root extends Component {
  render () {
    const { user } = this.props

    if (!user) return <div>Loading user...</div>

    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/new" component={New} />
        <Route render={() => 404} />
      </Switch>
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
