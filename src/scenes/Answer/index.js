import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import ReactMde, { ReactMdeCommands } from 'react-mde'

import { graphql } from 'react-apollo'
import { submitAnswer } from './queries'
import { getNode } from 'scenes/Question/queries'

import auth from 'auth'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'

import 'react-mde/lib/styles/css/react-mde-all.css'
import 'font-awesome/css/font-awesome.css'

class Answer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      answer: { text: '', selection: null },
      loading: false,
      redirect: false
    }
  }

  handleChange (value) {
    this.setState({ answer: value })
  }

  submitAnswer () {
    const { submit } = this.props
    const id = this.props.match.params.id

    this.setState({ loading: true })

    const answer = {
      content: this.state.answer.text,
      userId: auth.getUserNodeId()
    }

    submit(id, answer)
      .then(({ data }) => {
        this.setState({ redirect: true })
      })
      .catch(error => {
        alert(error)
        console.log(error)
      })
  }

  render () {
    const { match } = this.props
    const { loading, redirect } = this.state

    if (redirect) {
      return <Redirect to={`/q/${match.params.id}`} />
    }

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Link to={`/q/${match.params.id}`}>
          <Button icon="chevron_left" label="Back" flat primary />
        </Link>
        <br />
        <h3 style={{ textAlign: 'center' }}>Answer the question</h3>
        <Card>
          <CardText>
            <div className="container">
              <ReactMde
                value={this.state.answer}
                onChange={this.handleChange.bind(this)}
                commands={ReactMdeCommands.getDefaultCommands()}
              />
            </div>
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
              disabled={this.state.answer.text.length === 0}
              onClick={this.submitAnswer.bind(this)}
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default graphql(submitAnswer, {
  props: ({ mutate }) => ({
    submit: (id, answer) => {
      return mutate({ variables: { id, answer } })
    }
  }),
  options: props => ({
    refetchQueries: [
      {
        query: getNode,
        variables: {
          id: props.match.params.id
        }
      }
    ]
  })
})(Answer)
