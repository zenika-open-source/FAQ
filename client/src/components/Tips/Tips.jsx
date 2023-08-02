import PropTypes from 'prop-types'

import { CardText, PermanentClosableCard } from 'components/Card'

import './Tips.css'

const Tips = (props) => {
  const { uid, children, ...otherProps } = props
  return (
    <PermanentClosableCard {...otherProps} className="Tips" uid={uid}>
      <CardText>{props.children}</CardText>
    </PermanentClosableCard>
  )
}

Tips.propTypes = {
  uid: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Tips
