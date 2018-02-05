import React, { Component } from 'react';

import './style.css';

class Searchbar extends Component {
	render() {
		return (
			<div className="Searchbar" {...this.props}>
				<div className="search">
					<input type="text" className="searchTerm" placeholder="Ex: Comment remplir une note de frais ?"/>
					<button type="submit" className="searchButton">
						<i className="material-icons">search</i>
					</button>
				</div>
			</div>
		)
	}
}

export default Searchbar;
