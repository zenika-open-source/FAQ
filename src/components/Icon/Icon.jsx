import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const Icon = ({ material, className, ...rest }) => {
  if (material)
    return (
      <i className={cn('material-icons', className)} {...rest}>
        {material}
      </i>
    )

  // Currently, this component only support material-icons, but in the future, there could be others
  return null
}

Icon.propTypes = {
  material: PropTypes.string
}

export default Icon
