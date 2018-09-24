import React, { Component } from 'react'
import cn from 'classnames'

import HistoryActions from './HistoryActions.container'

import './History.css'

class History extends Component {
  state = {
    open: false
  }

  toggleState = () =>
    this.setState(state => ({
      open: !state.open
    }))

  render() {
    const { open } = this.state

    return (
      <div className="history">
        <div
          className={cn('toggler', open ? 'up' : 'down')}
          onClick={this.toggleState}
        >
          <span>history</span>
          <div className="arrow" />
        </div>
        {open && (
          <div className="actions">
            <HistoryActions />
          </div>
        )}
      </div>
    )
  }
}

export default History
