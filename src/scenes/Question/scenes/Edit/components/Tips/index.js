import React, { Component } from 'react'

import { Card, CardText } from 'react-toolbox/lib/card'
import { List, ListDivider } from 'react-toolbox/lib/list'

import Tip from './Tip'

import tips from './tips.json'

class Tips extends Component {
  render () {
    return (
      <Card {...this.props}>
        <CardText>
          <h3 style={{ textAlign: 'center' }}>
            Tips to write great questions on the FAQ
          </h3>
          <List>
            {tips.good.map((tip, i) => (
              <Tip key={i} tip={{ type: 'good', ...tip }} />
            ))}
            <ListDivider />
            {tips.bad.map((tip, i) => (
              <Tip key={i} tip={{ type: 'bad', ...tip }} />
            ))}
          </List>
        </CardText>
      </Card>
    )
  }
}

export default Tips
