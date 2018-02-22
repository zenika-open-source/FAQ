import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from 'react-toolbox/lib/button/Button'
import Chip from 'react-toolbox/lib/chip/Chip'

class NotFound extends Component {
  render () {
    const { history } = this.props
    return (
      <div>
        <Button
          icon="chevron_left"
          label="Go back"
          flat
          primary
          onClick={() => history.goBack()}
        />
        <div style={{ textAlign: 'center' }}>
          <h2>Ooops! 404</h2>
          <img src="/img/favicon/favicon-64.png" alt="emoji" />
          <br />
          <br />
          <Chip>
            Looks like we couldn&#39;t find what you were looking for...
          </Chip>
        </div>
      </div>
    )
  }
}

NotFound.propTypes = {
  history: PropTypes.object.isRequired
}

export default NotFound
