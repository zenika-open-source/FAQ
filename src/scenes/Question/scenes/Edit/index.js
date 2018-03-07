import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

import { compose } from 'react-apollo'
import { submitQuestion, editQuestion } from './queries'
import { getNode } from '../Read/queries'

import { auth } from 'services'

import Loading from 'components/Loading'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input/Input'

class Edit extends Component {
  constructor (props) {
    super(props)

    const { location } = this.props

    this.state = {
      question: location.state ? location.state.question : '',
      loadingSubmit: false,
      slug: null
    }

    this.isEditing = !!this.props.match.params.slug
  }

  componentDidMount () {
    if (this.isEditing) {
      const { ZNode } = this.props.data
      if (ZNode) {
        this.setState({ question: ZNode.question.title })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.isEditing) {
      const ZNode = this.props.data.ZNode
      const nextZNode = nextProps.data.ZNode

      if (!ZNode && nextZNode) {
        this.setState({ question: nextZNode.question.title })
      }
    }
  }

  handleChange (value) {
    this.setState({ question: value })
  }

  submitQuestion () {
    const { submitQuestion } = this.props

    this.setState({ loadingSubmit: true })

    submitQuestion(this.state.question, auth.getUserNodeId())
      .then(({ data }) => {
        this.setState({ slug: data.createZNode.question.slug })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  editQuestion () {
    const { editQuestion } = this.props
    const { ZNode } = this.props.data

    this.setState({ loadingSubmit: true })

    editQuestion(ZNode.question.id, this.state.question, auth.getUserNodeId())
      .then(({ data }) => {
        this.setState({ slug: data.updateQuestion.slug })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  render () {
    const { match } = this.props
    const { loadingSubmit, slug } = this.state

    if (slug) {
      return <Redirect to={`/q/${slug}`} />
    }

    if (loadingSubmit) {
      return <Loading />
    }

    if (this.isEditing) {
      const { loading, error, ZNode } = this.props.data

      if (loading) {
        return <Loading />
      }

      if (error) {
        return <div>Error :(</div>
      }

      if (ZNode === null) {
        return <Redirect to={`/q/${slug}`} />
      }
    }

    return (
      <div>
        {this.isEditing ? (
          <Link to={`/q/${match.params.slug}`}>
            <Button icon="chevron_left" label="Back" flat primary />
          </Link>
        ) : (
          <Link to="/">
            <Button icon="chevron_left" label="Home" flat primary />
          </Link>
        )}
        <br />
        <h3 style={{ textAlign: 'center' }}>
          {this.isEditing ? 'Edit question' : 'Ask a new question'}
        </h3>
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
              label={this.isEditing ? 'Edit' : 'Submit'}
              raised
              primary
              disabled={this.state.question.length === 0}
              onClick={
                this.isEditing
                  ? this.editQuestion.bind(this)
                  : this.submitQuestion.bind(this)
              }
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  submitQuestion: PropTypes.func.isRequired,
  editQuestion: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.object
}

export default compose(submitQuestion, editQuestion, getNode)(Edit)
