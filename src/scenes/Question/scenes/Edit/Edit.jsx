import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'

import { compose } from 'react-apollo'
import { submitQuestion, editQuestion } from './queries'
import { getNode } from 'scenes/Question/queries'

import Loading from 'components/Loading'
import Card, { CardText, CardActions } from 'components/Card'
import Button from 'components/Button'
import Input from 'components/Input'
import onCtrlEnter from 'components/onCtrlEnter'

import ActionMenu from '../../components/ActionMenu'

import Tips from './components/Tips'

import './Edit.css'

const CtrlEnterInput = onCtrlEnter(Input)

class Edit extends Component {
  constructor (props) {
    super(props)

    const { location } = this.props

    this.initialQuestion = location.state ? location.state.question : ''
    this.isEditing = !!this.props.match.params.slug

    this.state = {
      question: this.initialQuestion,
      loadingSubmit: false,
      slug: null
    }
  }

  componentDidMount () {
    if (this.isEditing) {
      const { ZNode } = this.props.data
      if (ZNode) {
        this.initialQuestion = ZNode.question.title
        this.setState({ question: ZNode.question.title })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.isEditing) {
      const ZNode = this.props.data.ZNode
      const nextZNode = nextProps.data.ZNode

      if (!ZNode && nextZNode) {
        this.initialQuestion = nextZNode.question.title
        this.setState({ question: nextZNode.question.title })
      }
    }
  }

  handleChange = e => {
    this.setState({ question: e.target.value })
  }

  submitForm = () => {
    this.isEditing ? this.editQuestion() : this.submitQuestion()
  }

  submitQuestion = () => {
    const { submitQuestion } = this.props

    this.setState({ loadingSubmit: true })

    submitQuestion(this.state.question)
      .then(({ data }) => {
        this.setState({
          slug: data.createZNode.question.slug + '-' + data.createZNode.id
        })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  editQuestion = () => {
    const { editQuestion } = this.props
    const { ZNode } = this.props.data

    this.setState({ loadingSubmit: true })

    editQuestion(ZNode.question.id, this.state.question)
      .then(({ data }) => {
        this.setState({
          slug: data.updateQuestion.slug + '-' + ZNode.id
        })
      })
      .catch(error => {
        alert(error)
        // eslint-disable-next-line
        console.log(error)
      })
  }

  render () {
    const { match } = this.props
    const { loadingSubmit, slug, question } = this.state

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
        return <Redirect to={'/'} />
      }
    }

    return (
      <div className="Edit">
        <Prompt message="Are you sure you want to leave this page with an unsaved question?" />
        <ActionMenu
          backLabel={this.isEditing ? 'Back' : 'Home'}
          backLink={this.isEditing ? `/q/${match.params.slug}` : '/'}
          title={this.isEditing ? 'Edit question' : 'Ask a new question'}
        />
        <Card>
          <CardText style={{ display: 'flex', paddingBottom: 0 }}>
            <CtrlEnterInput
              onCtrlEnterCallback={this.submitForm}
              autoFocus
              icon="help"
              placeholder="Ex: Comment remplir une note de frais ?"
              limit={100}
              value={question}
              onChange={this.handleChange}
            />
          </CardText>
          <CardActions>
            <Button
              label={this.isEditing ? 'Edit' : 'Submit'}
              disabled={
                question.length === 0 || question === this.initialQuestion
              }
              primary
              raised
              onClick={this.submitForm}
            />
          </CardActions>
        </Card>
        <Tips style={{ marginTop: '1rem' }} />
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
