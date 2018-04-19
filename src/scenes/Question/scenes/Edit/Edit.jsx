import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Prompt } from 'react-router-dom'

import { compose } from 'react-apollo'
import { submitQuestion, editQuestion } from './queries'
import { getNode } from 'scenes/Question/queries'

import Loading from 'components/Loading'
import Card, {
  CardText,
  CardActions,
  PermanentClosableCard
} from 'components/Card'
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

    const initialQuestion = location.state ? location.state.question : ''

    this.state = {
      nodeLoaded: false,
      initialQuestion: initialQuestion,
      isEditing: !!this.props.match.params.slug,
      question: initialQuestion,
      loadingSubmit: false,
      slug: null,
      showTips: PermanentClosableCard.isOpen('tips_question')
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { nodeLoaded, isEditing } = prevState
    const { data } = nextProps

    if (!nodeLoaded && isEditing && data && data.ZNode) {
      return {
        nodeLoaded: true,
        initialQuestion: data.ZNode.question.title,
        question: data.ZNode.question.title
      }
    }

    return null
  }

  handleChange = e => {
    this.setState({ question: e.target.value })
  }

  submitForm = () => {
    const { isEditing } = this.state
    isEditing ? this.editQuestion() : this.submitQuestion()
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

  openTips = () => {
    this.setState({ showTips: true })
    PermanentClosableCard.setValue('tips_question', true)
  }

  closeTips = () => {
    this.setState({ showTips: false })
    PermanentClosableCard.setValue('tips_question', false)
  }

  render () {
    const { match } = this.props
    const {
      isEditing,
      initialQuestion,
      loadingSubmit,
      slug,
      question,
      showTips
    } = this.state

    if (slug) {
      return <Redirect to={`/q/${slug}`} />
    }

    if (loadingSubmit) {
      return <Loading />
    }

    if (isEditing) {
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
          backLabel={isEditing ? 'Back' : 'Home'}
          backLink={isEditing ? `/q/${match.params.slug}` : '/'}
          title={isEditing ? 'Edit question' : 'Ask a new question'}
        >
          {!showTips && (
            <Button
              link
              icon="lightbulb_outline"
              label="Show tips"
              onClick={this.openTips}
            />
          )}
        </ActionMenu>
        <Tips close={this.closeTips} open={showTips} />
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
              label={isEditing ? 'Edit' : 'Submit'}
              disabled={question.length === 0 || question === initialQuestion}
              primary
              raised
              onClick={this.submitForm}
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
