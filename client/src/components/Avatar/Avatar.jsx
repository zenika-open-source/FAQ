import PropTypes from 'prop-types'

const Avatar = ({ image, alt, ...otherProps }) => (
  <img className="w-10 h-auto" src={image} alt={alt || 'avatar'} {...otherProps} />
)

Avatar.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string,
}

export default Avatar
