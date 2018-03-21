import React from 'react'

import Card, { CardText } from 'components/Card'

const Tips = props => (
  <Card {...props}>
    <CardText>
      <h3 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
        Tips to write great questions on the FAQ
      </h3>
      --Need help--
    </CardText>
  </Card>
)

export default Tips
