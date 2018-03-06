import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from 'react-toolbox/lib/button/Button'

class Pagination extends Component {
  render () {
    const { pages, current, onPageSelected } = this.props

    const buttonStyle = {
      minWidth: 'initial'
    }

    const buttons = [...Array(pages)].map((x, i) => {
      const isCurrent = i + 1 === current
      return (
        <Button
          key={i}
          label={i + 1 + ''}
          style={buttonStyle}
          raised={isCurrent}
          accent={isCurrent}
          onClick={() => !isCurrent && onPageSelected(i + 1)}
        />
      )
    })

    return (
      <div style={{ textAlign: 'center' }}>
        <Button
          icon="chevron_left"
          disabled={current === 1}
          onClick={() => onPageSelected(current - 1)}
        />
        {buttons}
        <Button
          icon="chevron_right"
          disabled={current === pages}
          onClick={() => onPageSelected(current + 1)}
        />
      </div>
    )
  }
}

Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  onPageSelected: PropTypes.func.isRequired
}

export default Pagination
