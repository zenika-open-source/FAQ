import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './style.css'

class Searchbar extends Component {
  render () {
    const { text, search, loading, style } = this.props
    return (
      <div className="Searchbar" style={style}>
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="Ex: Comment remplir une note de frais ?"
            value={text}
            onChange={e => search(e.target.value)}
          />
          <button type="submit" className="searchButton">
            <span style={{ display: loading ? 'initial' : 'none' }}>
              <i className="fas fa-spinner fa-pulse" />
            </span>
            <span style={{ display: loading ? 'none' : 'initial' }}>
              <i className="material-icons">search</i>
            </span>
          </button>
        </div>
      </div>
    )
  }
}

Searchbar.propTypes = {
  text: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  style: PropTypes.object
}

export default Searchbar
