import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import Checkbox from 'components/Checkbox'

class Consent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      consent: {
        name: false,
        picture: false,
        email: false
      }
    }
  }

  render () {
    const { name, picture, email } = this.state.consent
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>Consent to store your personal data</h1>
        <p>
          This form gives you the opportunity to select what data FAQ may store about you. Please read carefully.
          These options enhance the experience of FAQ but they are <em>not</em> required.
          They can be changed later and at any time from your profile page.
        </p>
        <form>
          <Checkbox checked={name} label="FAQ may store my name in order to display it against questions that I have asked, answers that I have written, and flags that I have placed." />
          <Checkbox checked={picture} label="FAQ may store my profile picture in order to display it against questions that I have asked, answers that I have written, and flags that I have placed." />
          <Checkbox checked={email} label="FAQ may store my email address in order to send me notifications when questions or answers that I follow are updated." />
          <Button type="button" primary raised onClick={() => this.props.submit(this.state.consent)}>Submit</Button>
        </form>
      </div>
    )
  }
}

Consent.propTypes = {
  submit: PropTypes.func
}

export default Consent
