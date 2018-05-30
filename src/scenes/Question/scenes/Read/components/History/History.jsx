import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Query } from 'react-apollo'

import { loadHistoryQuery } from 'services/history'

import HistoryActions from './HistoryActions'

import './History.css'

class History extends Component {
  state = {
    open: false
  }

  toggleState = () =>
    this.setState(state => ({
      open: !state.open
    }))

  render () {
    const { node } = this.props
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
            <Query query={loadHistoryQuery} variables={{ nodeId: node.id }}>
              {({ loading, error, data }) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`

                return <HistoryActions actions={data.allHistoryActions} />
              }}
            </Query>
          </div>
        )}
      </div>
    )
  }
}

History.propTypes = {
  node: PropTypes.object.isRequired
}

export default History
