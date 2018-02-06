import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '~/actions'

import './style.css'

class Searchbar extends Component {
	render() {
		const {text,search} = this.props
		return (
			<div className="Searchbar" style={this.props.style}>
				<div className="search">
					<input type="text" className="searchTerm" placeholder="Ex: Comment remplir une note de frais ?" value={text} onChange={(e) => search(e.target.value)}/>
					<button type="submit" className="searchButton">
						<i className="material-icons">search</i>
					</button>
				</div>
			</div>
		)
	}
}

Searchbar.propTypes = {
	text: PropTypes.string.isRequired,
	search: PropTypes.func.isRequired,
	style: PropTypes.object
}

const mapStateToProps = state => ({ text: state.search.text })

const mapDispatchToProps = dispatch => ({
	search: bindActionCreators(Actions, dispatch).search
})

export default connect(mapStateToProps,mapDispatchToProps)(Searchbar)
