import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Searchbar from '~/components/Searchbar'
import QuestionCard from '~/components/QuestionCard'

class Home extends Component {
	render() {
		const {questions,filtered} = this.props

		const list = filtered.length > 0 ? filtered.map(x=>x.item) : questions

		const QuestionsList = list.map((question,index)=>(<QuestionCard style={{width: '70%', marginLeft: 'auto', marginRight: 'auto'}} question={question} key={index}/>))

		return (
			<div className='Home'>
				<h1 style={{textAlign: 'center'}}>FAQ Zenika</h1>
				<Searchbar style={{marginTop:'3rem', marginBottom: '2rem'}}/>
				{QuestionsList}
			</div>
		)
	}
}

Home.propTypes = {
	questions: PropTypes.array.isRequired,
	filtered: PropTypes.array.isRequired
}

const mapStateToProps = state => state.questions

export default connect(mapStateToProps)(Home)
