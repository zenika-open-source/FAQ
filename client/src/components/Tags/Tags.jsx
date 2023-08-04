import PropTypes from 'prop-types'

const Tags = ({ tags, ...rest }) => (
  <div className="flex items-center mt-2" {...rest}>
    <i className="material-icons text-[0.8rem] mr-1 text-primary -mb-[0.2rem]">local_offer</i>
    <div className="flex items-center" style={{ fontVariant: 'small-caps' }}>
      {tags.map((tag) => tag.label.name.toLowerCase()).join(', ')}
    </div>
  </div>
)

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
}

export default Tags
