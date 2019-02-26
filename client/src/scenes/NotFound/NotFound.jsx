import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import Button from 'components/Button'

const NotFound = ({ history }) => (
  <div>
    <Button icon="chevron_left" label="Home" link onClick={() => history.push('/')} />
    <div style={{ textAlign: 'center' }}>
      <h1>Ooops! 404</h1>
      <br />
      <br />
      <img src="/img/favicon/favicon-64.png" alt="emoji" />
      <br />
      <br />
      <h3>Looks like we couldn&#39;t find what you were looking for...</h3>
    </div>
  </div>
)

NotFound.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(NotFound)
