import React from 'react'

import Card, { PermanentClosableCard } from 'components/Card'

import './Tips.scss'

const Tips = props => {
  const { uid, children, ...otherProps } = props
  return (
    <PermanentClosableCard {...otherProps} className="Tips" uid={uid}>
      <Card.Text>{props.children}</Card.Text>
    </PermanentClosableCard>
  )
}

export default Tips
