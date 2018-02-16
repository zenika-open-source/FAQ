import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import Button from 'react-toolbox/lib/button/Button'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'

import { search } from './actions'

import Searchbar from './components/Searchbar'
import QuestionCard from './components/QuestionCard'

import './style.css'

const TooltipButton = Tooltip()(Button)

class Home extends Component {
  render () {
    const { questions, filtered, searchText, searchAction } = this.props

    const list =
      filtered.length > 0 ? filtered.map(x => x.item) : questions.slice(0, 10)

    const QuestionsList = list.map((question, index) => (
      <QuestionCard question={question} key={index} />
    ))

    let Results

    if (searchText === '') {
      Results = (
        <div>
          <p className="indication">Latest questions</p>
          {QuestionsList}
        </div>
      )
    } else if (filtered.length > 0) {
      Results = (
        <div>
          <p className="indication">
            {filtered.length} result{filtered.length > 1 ? 's' : ''} found
          </p>
          {QuestionsList}
        </div>
      )
    } else {
      Results = (
        <p className="indication" style={{ textAlign: 'center' }}>
          Nothing found &nbsp;<i className="material-icons">sms_failed</i>
        </p>
      )
    }

    return (
      <div className="Home">
        <h1 style={{ textAlign: 'center' }}>FAQ Zenika</h1>
        <Searchbar
          text={searchText}
          search={searchAction}
          style={{ marginTop: '3rem', marginBottom: '2rem' }}
        />
        <div className="results">{Results}</div>
        <Link to="/new">
          <TooltipButton
            icon="add"
            tooltip="Ask a new question"
            floating
            accent
            mini
            style={{
              position: 'fixed',
              bottom: '1rem',
              right: '1rem'
            }}
          />
        </Link>
      </div>
    )
  }
}

Home.propTypes = {
  questions: PropTypes.array.isRequired,
  filtered: PropTypes.array.isRequired,
  searchText: PropTypes.string.isRequired,
  searchAction: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  questions: state.data.questions,
  filtered: state.scenes.home.data.filtered,
  searchText: state.scenes.home.text
})

const mapDispatchToProps = dispatch => ({
  searchAction: bindActionCreators(search, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
