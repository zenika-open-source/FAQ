import React, { Component } from 'react'

import { Card, CardText } from 'react-toolbox/lib/card'
import { List, ListItem, ListDivider } from 'react-toolbox/lib/list'
import FontIcon from 'react-toolbox/lib/font_icon'

import tips from './tips.json'

class Tips extends Component {
  render () {
    return (
      <Card {...this.props}>
        <CardText>
          <h3 style={{ textAlign: 'center' }}>
            Tips to write great questions on the FAQ
          </h3>
          <List selectable>
            {tips.good.map((tip, i) => (
              <ListItem
                key={i}
                caption={tip.text}
                leftIcon={
                  <FontIcon
                    value="check"
                    style={{ color: 'green', marginTop: '2px' }}
                  />
                }
                onClick={() =>
                  tip.url ? window.open(tip.url, '_blank') : null
                }
              />
            ))}
            <ListDivider />
            {tips.bad.map((tip, i) => (
              <ListItem
                key={i}
                caption={tip.text}
                legend={tip.hint}
                leftIcon={
                  <FontIcon
                    value="close"
                    style={{ color: 'red', marginTop: '2px' }}
                  />
                }
                onClick={() =>
                  tip.url ? window.open(tip.url, '_blank') : null
                }
              />
            ))}
          </List>
        </CardText>
      </Card>
    )
  }
}

export default Tips
