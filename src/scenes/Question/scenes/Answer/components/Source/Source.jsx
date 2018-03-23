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
  /* return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div>
        <FontIcon value="library_books" style={{ marginRight: '1rem' }} />
      </div>
      <div >
        <Input
          type="text"
          label="Label"
          value={props.source.label}
          onChange={props.changeLabel}
        />
      </div>
      <div >
        <Input
          type="text"
          label="URL"
          value={props.source.url}
          onChange={props.changeUrl}
        />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <Button
          icon={
            <i
              className="material-icons"
              style={{ marginLeft: '6px', paddingTop: '6px' }}
            >
              close
            </i>
          }
          style={{ minWidth: 'initial', alignItems: 'center' }}
          accent
          onClick={props.delete}
        />
      </div>
    </div>
  ) */
}

Source.propTypes = {
  source: PropTypes.object.isRequired,
  changeLabel: PropTypes.func.isRequired,
  changeUrl: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
}

export default Source
