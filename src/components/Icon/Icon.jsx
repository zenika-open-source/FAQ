import React from 'react'
import PropTypes from 'prop-types'

const Icon = ({ material, ...rest }) => {
  if (material)
    return (
      <i className="material-icons" {...rest}>
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
