import PropTypes from 'prop-types'

const ListItem = ({ caption, icon, href }) => {
  const ret = (
    <div className="px-[0.6rem] py-[0.4rem] inline-flex items-center cursor-pointer hover:bg-secondary">
      {icon && <i className="material-icons mr-2 text-[18px]">{icon}</i>}
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
