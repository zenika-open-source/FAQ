import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

/* Why this route ?
  - We use HashRouter (because we have a static hosting)
  - Auth0 do not allow a "query" (aka: ?x=y ) responseMode
  - Auth0 sends params as fragments (#)
  - HashRouter interprets it as a route */

const AccessToken = ({ error, match }) => (
  <Redirect
    to={{
      pathname: '/auth/callback',
      search: (error ? '?error=' : '?access_token=') + match.params.rest
    }}
  />
)

AccessToken.propTypes = {
  match: PropTypes.object.isRequired,
  error: PropTypes.bool
}

export default AccessToken
