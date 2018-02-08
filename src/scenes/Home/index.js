import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Searchbar from 'components/Searchbar'
import QuestionCard from 'components/QuestionCard'

import './style.css'

class Home extends Component {
  render () {
    const { questions, filtered, searchText } = this.props

    const list =
      filtered.length > 0
        ? filtered.map(x => x.item)
        : questions.reverse().slice(0, 10)

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
          <p className="indication">{filtered.length} results found</p>
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
        <Searchbar style={{ marginTop: '3rem', marginBottom: '2rem' }} />
        <div className="results">{Results}</div>
      </div>
    )
  }
}

Home.propTypes = {
  questions: PropTypes.array.isRequired,
  filtered: PropTypes.array.isRequired,
  searchText: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  questions: state.questions.questions,
  filtered: state.questions.filtered,
  searchText: state.search.text
})

export default connect(mapStateToProps)(Home)
