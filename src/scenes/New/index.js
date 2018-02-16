import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, Redirect } from 'react-router-dom'
import { set } from 'immutadot'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'
import Input from 'react-toolbox/lib/input/Input'

import { newQuestion } from './actions'

class New extends Component {
  constructor (props) {
    super(props)

    this.state = {
      question: '',
      submitted: false
    }
  }

  handleChange (value) {
    this.setState(state => set(state, 'question', value))
  }

  submitQuestion () {
    const { newQuestion } = this.props
    newQuestion(this.state.question)
  }

  render () {
    const { loading, newQuestionId } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    if (newQuestionId) {
      return <Redirect to={`q/${newQuestionId}`} />
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
              onClick={this.submitQuestion.bind(this)}
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

New.propTypes = {
  loading: PropTypes.bool.isRequired,
  newQuestionId: PropTypes.number,
  newQuestion: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  loading: state.scenes.new.loading,
  newQuestionId: state.scenes.new.newQuestionId
})

const mapDispatchToProps = dispatch => ({
  newQuestion: bindActionCreators(newQuestion, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(New)
