import PropTypes from 'prop-types'

import './Avatar.css'

const Avatar = ({ image, alt, ...otherProps }) => (
  <img className="avatar" src={image} alt={alt || 'avatar'} {...otherProps} />
)

Avatar.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string,
}

export default Avatar
