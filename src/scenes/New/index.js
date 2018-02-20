import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

import { graphql } from 'react-apollo'
import { submitQuestion } from './queries'

import auth from 'auth'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input/Input'

class New extends Component {
  constructor (props) {
    super(props)

    this.state = {
      question: '',
      loading: false,
      id: null
    }
  }

  handleChange (value) {
    this.setState({ question: value })
  }

  submitQuestion () {
    const { submit } = this.props

    this.setState({ loading: true })

    submit(this.state.question, auth.getUserNodeId())
      .then(({ data }) => {
        this.setState({ id: data.createZNode.id })
      })
      .catch(error => {
        alert(error)
        console.log(error)
      })
  }

  render () {
    const { id, loading } = this.state

    if (id) {
      return <Redirect to={`/q/${id}`} />
    }

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Link to="/">
          <Button icon="chevron_left" label="Home" flat primary />
        </Link>
        <br />
        <h3 style={{ textAlign: 'center' }}>Ask a new question</h3>
        <Card>
          <CardText>
            <Input
              type="text"
              label="Type your question here..."
              maxLength={100}
              value={this.state.question}
              onChange={this.handleChange.bind(this)}
            />
          </CardText>
          <CardActions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              label="Submit"
              raised
              primary
              disabled={this.state.question.length === 0}
              onClick={this.submitQuestion.bind(this)}
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default graphql(submitQuestion, {
  props: ({ mutate }) => ({
    submit: (title, id_user) => {
      return mutate({ variables: { title, id_user } })
    }
  })
})(New)
