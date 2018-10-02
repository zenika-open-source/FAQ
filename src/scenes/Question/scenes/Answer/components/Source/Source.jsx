import React from 'react'
import PropTypes from 'prop-types'

import Input from 'components/Input'
import Button from 'components/Button'

import './Source.css'

const Source = props => {
  return (
    <div className="answer-source">
      <i className="material-icons">info_outline</i>
      <div className="inputs">
        <Input
          className="source-label"
          icon="label_outline"
          placeholder="Label"
          value={props.source.label}
          onChange={e => props.changeLabel(e.target.value)}
        />
        <Input
          className="source-link"
          icon="link"
          placeholder="URL"
          value={props.source.url}
          onChange={e => props.changeUrl(e.target.value)}
        />
      </div>
      <Button
        style={{ padding: '0.3rem', marginLeft: '0.5rem' }}
        icon="close"
        link
        raised
        onClick={props.delete}
      />
    </div>
  )
}

Source.propTypes = {
  source: PropTypes.object.isRequired,
  changeLabel: PropTypes.func.isRequired,
  changeUrl: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
}

export default Source
