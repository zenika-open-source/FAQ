import PropTypes from 'prop-types'

const CardAction = ({ children, ...otherProps }) => (
  <div
    className="flex items-center justify-end p-4 pt-0 bg-secondary-light text-secondary-font max-[480px]:p-[0.4rem]"
    {...otherProps}
  >
    {children}
  </div>
)

CardAction.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CardAction
