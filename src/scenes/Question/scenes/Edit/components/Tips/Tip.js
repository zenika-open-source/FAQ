import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ListItem } from 'react-toolbox/lib/list'
import FontIcon from 'react-toolbox/lib/font_icon'

class Tip extends Component {
  render () {
    const { tip } = this.props

    return (
      <ListItem
        selectable
        caption={tip.text}
        legend={tip.hint}
        leftIcon={
          <FontIcon
            value={tip.type === 'good' ? 'check' : 'close'}
            style={{
              color: tip.type === 'good' ? 'green' : 'red',
              marginTop: '2px'
            }}
          />
        }
        onClick={() => (tip.url ? window.open(tip.url, '_blank') : null)}
      />
    )
  }
}

Tip.propTypes = {
  tip: PropTypes.object.isRequired
}

export default Tip
