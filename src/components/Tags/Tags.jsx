import React from 'react'
import PropTypes from 'prop-types'

import './Tags.css'

const Tags = props => {
  const { tags, ...otherProps } = props

  return (
    <div className="tags" {...otherProps}>
      <i className="material-icons">local_offer</i>
      <div className="tags-list">{tags.map(tag => tag.label).join(', ')}</div>
    </div>
  )
}

Tags.list = {
  services: [
    'paie',
    'ops',
    'recrutement',
    'rh',
    'dsi',
    'compta',
    'formation',
    'ce'
  ],
  agency: [
    'nantes',
    'paris',
    'rennes',
    'lyon',
    'lille',
    'bordeaux',
    'singapour',
    'montréal'
  ],
  theme: [
    'nouvel arrivant',
    'formateur',
    'fin du mois',
    'mission',
    'tutoriel',
    'matériel',
    'meta'
  ]
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired
}

export default Tags
