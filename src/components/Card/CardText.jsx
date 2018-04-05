import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const CardText = ({ children, collapsed, setRef, ...otherProps }) => (
  <div
    className={cn('card-item card-text', { collapsed })}
    ref={ref => setRef && setRef(ref)}
    {...otherProps}
  >
    {children}
  </div>
)

CardText.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool,
  setRef: PropTypes.func
}

export default CardText