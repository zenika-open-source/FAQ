import cn from 'classnames'
import PropTypes from 'prop-types'

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
  material: PropTypes.string,
  className: PropTypes.string,
}

export default Icon
