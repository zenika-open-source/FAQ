import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { markdown } from 'services'

import Loading from 'components/Loading'
import Button from 'components/Button'
import Card, { CardText, CardActions } from 'components/Card'
import Avatar from 'components/Avatar'

import { compose } from 'react-apollo'
import { getAllPersonalData, updateIdentity } from './queries'

class UserProfile extends Component {
  constructor (props) {
    super(props)
    this.state = { savingIdentity: false }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!nextProps.data || !nextProps.data.User) {
      return null
    }
    const { name, email, picture } = nextProps.data.User
    return { identity: { name, email, picture }, ...prevState }
  }

  onIdentityChange (event) {
    this.setState({
      identity: {
        ...this.state.identity,
        [event.target.name]: event.target.value
      }
    })
  }

  async updateIdentity (id, identity) {
    const { updateIdentity } = this.props
    this.setState({ savingIdentity: true })
    try {
      await updateIdentity(id, identity)
    } finally {
      this.setState({ savingIdentity: false })
    }
  }

  render () {
    const { loading, error, User } = this.props.data

    if (loading) {
      return <Loading />
    }

    if (error || User === null) {
      return <div>Error :(</div>
    }

    const userLog = User.history

    const { savingIdentity, identity: { name, email, picture } } = this.state

    return (
      <div>
        <Card>
          <CardText>
            <h1>Profile</h1>
            <p>
              This page displays all your personal data (as defined by the GDPR)
              processed by FAQ.
            </p>
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
                  image={User.picture}
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
                disabled={savingIdentity}
                onClick={() =>
                  this.updateIdentity(User.id, this.state.identity)
                }
              >
                {savingIdentity ? 'Saving...' : 'Save'}
              </Button>
            </CardActions>
          </CardText>
        </Card>
        <Card>
          <CardText>
            <h1>Log</h1>
            <table className="card-table">
              <thead>
                <tr>
                  <td>Action</td>
                  <td>When</td>
                  <td>Meta</td>
                  <td>Question</td>
                </tr>
              </thead>
              <tbody>
                {userLog.map(({ id, action, model, meta, createdAt, node }) => (
                  <tr key={id}>
                    <td>
                      {action} {model}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{createdAt}</td>
                    <td>{JSON.stringify(meta)}</td>
                    <td style={{ wordBreak: 'break-word' }}>
                      <Link to={`/q/${node.question.slug}-${node.id}`}>
                        {markdown.title(node.question.title)}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardText>
        </Card>
      </div>
    )
  }
}

UserProfile.propTypes = {
  history: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  updateIdentity: PropTypes.func.isRequired
}

export default compose(getAllPersonalData, updateIdentity)(UserProfile)
