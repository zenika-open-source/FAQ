import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AuthContext } from 'contexts'
import { alert } from 'services'

import { Avatar, Button } from 'components'
import Card, { CardText, CardActions } from 'components/Card'

import Logs from './components/Logs'

import { updateIdentity, deleteIdentity } from './queries'
import auth from 'services/auth'
import { Redirect } from 'react-router-dom'

class UserProfile extends Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      identity: props.me,
      savingIdentity: false
    }
  }

  state = {
    redirectToLogin: false
  }

  onIdentityChange(event) {
    this.setState({
      identity: {
        ...this.state.identity,
        [event.target.name]: event.target.value
      }
    })
  }

  async updateIdentity(identity) {
    const { updateIdentity } = this.props
    this.setState({ savingIdentity: true })
    try {
      await updateIdentity(identity)
        .then(() => {
          alert.pushSuccess('Your profile was successfully updated!')
        })
        .catch(error => {
          alert.pushDefaultError(error)
        })
    } finally {
      this.setState({ savingIdentity: false })
    }
  }

  async deleteIdentity(identity) {
    if (!window.confirm('Are you sure you want to be forgotten? This is irreversible.')) {
      return
    }
    const { deleteIdentity } = this.props
    this.setState({ deletingIdentity: true })
    try {
      await deleteIdentity(identity)
    } finally {
      this.setState({ deletingIdentity: false })
    }
    auth.logout()
    this.setState({ redirectToLogin: true })
  }

  render() {
    const {
      savingIdentity,
      identity: { name, email, picture },
      redirectToLogin
    } = this.state

    if (redirectToLogin) {
      return <Redirect to="auth/login" />
    }

    const auth = this.context

    return (
      <div>
        <Card>
          <CardText>
            <h1 className="centered">Profile</h1>
          </CardText>
        </Card>
        <Card>
          <CardText>
            <h1>Identity</h1>
            <form className="card-form">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                className="card-input"
                value={name}
                onChange={e => this.onIdentityChange(e)}
                autoComplete="off"
              />
              <label htmlFor="email">Email address</label>
              <input
                name="email"
                className="card-input"
                value={email}
                onChange={e => this.onIdentityChange(e)}
              />
              <label htmlFor="picture">Picture link</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  image={picture}
                  style={{
                    width: '60px',
                    height: '60px',
                    marginRight: '20px'
                  }}
                />
                <input
                  name="picture"
                  className="card-input"
                  value={picture}
                  onChange={e => this.onIdentityChange(e)}
                />
              </div>
            </form>
            <CardActions>
              <Button
                primary
                type="button"
                onClick={() => this.deleteIdentity(this.state.identity)}
              >
                Forget Me
              </Button>
              <Button
                primary
                type="button"
                disabled={savingIdentity}
                onClick={() => this.updateIdentity(this.state.identity)}
              >
                {savingIdentity ? 'Saving...' : 'Save'}
              </Button>
            </CardActions>
          </CardText>
        </Card>
        <Logs userId={auth.user.id} />
        <Card>
          <CardText>
            <h1 style={{ marginBottom: '1rem' }}>GDPR</h1>
            <p>
              <span style={{ marginRight: '5px' }}>
                You can contact us about any GDPR-related issue at:
              </span>
              <a href="mailto:mydata@zenika.com">mydata@zenika.com</a>
            </p>
          </CardText>
        </Card>
      </div>
    )
  }
}

UserProfile.propTypes = {
  history: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  updateIdentity: PropTypes.func.isRequired,
  deleteIdentity: PropTypes.func.isRequired
}

export default deleteIdentity(updateIdentity(UserProfile))
