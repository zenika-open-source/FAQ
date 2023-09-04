import PropTypes from 'prop-types'

import { CardText, PermanentClosableCard } from 'components/Card'

const Tips = (props) => {
  const { uid, children, ...otherProps } = props
  return (
    <PermanentClosableCard {...otherProps} uid={uid}>
      <CardText>{props.children}</CardText>
    </PermanentClosableCard>
  )
}

Tips.propTypes = {
  uid: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Tips
