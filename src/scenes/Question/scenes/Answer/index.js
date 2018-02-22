import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

import { graphql } from 'react-apollo'
import { submitAnswer } from './queries'
import { getNode } from '../Read/queries'

import { auth, markdown } from 'services'

import NotFound from 'scenes/NotFound'

import Loading from 'components/Loading'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'

import ReactMde, { ReactMdeCommands } from 'react-mde'
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

    this.setState({ loadingSubmit: true })

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
        // eslint-disable-next-line
        console.log(error)
      })
  }

  render () {
    const { match } = this.props
    const { loadingSubmit, redirect } = this.state
    const { loading, error, ZNode } = this.props.data

    if (redirect) {
      return <Redirect to={`/q/${match.params.id}`} />
    }

    if (loadingSubmit || loading) {
      return <Loading />
    }

    if (error) {
      return <div>Error :(</div>
    }

    if (ZNode === null) {
      return <NotFound {...this.props} />
    }

    if (ZNode.answer !== null) {
      return <Redirect to={`/q/${match.params.id}`} />
    }

    return (
      <div>
        <Link to={`/q/${match.params.id}`}>
          <Button icon="chevron_left" label="Back" flat primary />
        </Link>
        <br />
        <h3 style={{ textAlign: 'center' }}>
          {markdown.title(ZNode.question.title)}
        </h3>
        <Card>
          <CardText>
            <div className="container">
              <ReactMde
                value={this.state.answer}
                showdownFlavor="github"
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

Answer.propTypes = {
  match: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
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
})(
  graphql(getNode, {
    options: ({ match }) => ({ variables: { id: match.params.id } })
  })(Answer)
)
