import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const AccessToken = props => {
  /* Why this route ?
    - We use HashRouter (because we have a static hosting)
    - Auth0 do not allow a "query" responseMode
    - Auth0 sends params as fragments (#)
    - HashRouter interprets it as a route */
  return (
    <Redirect
      to={{
        pathname: '/auth/callback',
        search: '?access_token=' + props.match.params.rest
      }}
    />
  )
}

AccessToken.propTypes = {
  match: PropTypes.object.isRequired
}

export default AccessToken