import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactMde, { ReactMdeCommands } from 'react-mde'

import Button from 'react-toolbox/lib/button/Button'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'

import 'react-mde/lib/styles/css/react-mde-all.css'
import 'font-awesome/css/font-awesome.css'

class New extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reactMdeValue: { text: '', selection: null }
    }
  }

  handleValueChange (value) {
    this.setState({ reactMdeValue: value })
  }

  render () {
    const { match } = this.props
    return (
      <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Link to={`/q/${match.params.id}`}>
          <Button icon="chevron_left" label="Back" flat primary />
        </Link>
        <br />
        <h3 style={{ textAlign: 'center' }}>Answer the question</h3>
        <Card>
          <CardText>
            <div className="container">
              <ReactMde
                value={this.state.reactMdeValue}
                onChange={this.handleValueChange.bind(this)}
                commands={ReactMdeCommands.getDefaultCommands()}
              />
            </div>
          </CardText>
          <CardActions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            {/* <Button label="Preview" accent /> */}
            <Button label="Submit" raised primary />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default New
