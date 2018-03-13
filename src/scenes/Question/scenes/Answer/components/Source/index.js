import React from 'react'
import PropTypes from 'prop-types'

import Input from 'react-toolbox/lib/input/Input'
import Button from 'react-toolbox/lib/button/Button'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

const Source = props => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div>
        <FontIcon value="library_books" style={{ marginRight: '1rem' }} />
      </div>
      <div style={{ marginRight: '1rem', width: '40%' }}>
        <Input
          type="text"
          label="Label"
          value={props.source.label}
          onChange={props.changeLabel}
        />
      </div>
      <div style={{ flex: '1' }}>
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
  )
}

Source.propTypes = {
  source: PropTypes.object.isRequired,
  changeLabel: PropTypes.func.isRequired,
  changeUrl: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
}

export default Source
