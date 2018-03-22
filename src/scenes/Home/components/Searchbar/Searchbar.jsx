import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import capitalize from 'lodash/capitalize'

import Input from 'components/Input'
import Checkbox from 'components/Checkbox'

import './Searchbar.css'

const Searchbar = ({ text, search, loading, filters, onToggleCheck }) => (
  <div className="searchbar">
    <Input
      autoFocus
      icon={
        <Fragment>
          <span
            style={{ display: loading && text !== '' ? 'none' : 'flex' }}
            onClick={() => this.input.focus()}
          >
            <i className="material-icons">search</i>
          </span>
          <span style={{ display: loading && text !== '' ? 'flex' : 'none' }}>
            <i className="fas fa-spinner fa-pulse" />
          </span>
        </Fragment>
      }
      value={text}
      onChange={e => search(e.target.value)}
    />
    <div className="filters">
      {map(filters, (checked, filter) => (
        <Checkbox
          key={filter}
          label={capitalize(filter)}
          checked={checked}
          onChange={() => {
            filters[filter] = !filters[filter]
            onToggleCheck(filters)
          }}
        />
      ))}
    </div>
  </div>
)

Searchbar.propTypes = {
  text: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  onToggleCheck: PropTypes.func.isRequired
}

export default Searchbar
