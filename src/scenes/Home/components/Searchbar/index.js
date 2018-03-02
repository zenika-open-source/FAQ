import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Checkbox from 'react-toolbox/lib/checkbox/Checkbox'

import './style.css'

class Searchbar extends Component {
  componentDidMount () {
    const input = this.input
    const length = input.value.length
    input.focus()
    input.setSelectionRange(length, length)
  }

  render () {
    const { text, search, loading, checked, onToggleCheck, style } = this.props
    return (
      <div className="Searchbar" style={style}>
        <div className="search">
          <input
            type="text"
            ref={ref => (this.input = ref)}
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
        <span style={{ float: 'left', marginTop: '10px' }}>
          <Checkbox
            checked={checked}
            onChange={onToggleCheck}
            label="Answered only"
          />
        </span>
      </div>
    )
  }
}

Searchbar.propTypes = {
  text: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onToggleCheck: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default Searchbar
