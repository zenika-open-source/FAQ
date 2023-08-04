import PropTypes from 'prop-types'

const ListItem = ({ caption, icon, href }) => {
  const ret = (
    <div className="list-item">
      {icon && <i className="material-icons text-[18px]">{icon}</i>}
      {caption}
    </div>
  )

  return href ? (
    <a className="discret" href={href} target="_blank" rel="noopener noreferrer">
      {ret}
    </a>
  ) : (
    ret
  )
}

ListItem.propTypes = {
  caption: PropTypes.node.isRequired,
  icon: PropTypes.string,
  href: PropTypes.string,
}

export default ListItem
