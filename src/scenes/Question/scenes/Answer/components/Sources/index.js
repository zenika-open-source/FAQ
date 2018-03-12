import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'

import Source from '../Source'

import Button from 'react-toolbox/lib/button/Button'

class Sources extends Component {
  addSource () {
    const { sources, handleChange } = this.props
    handleChange(sources.concat([{ id: uuid(), label: '', url: '' }]))
  }

  changeLabel (id, label) {
    const { sources, handleChange } = this.props
    handleChange(
      sources.map(s => {
        if (s.id !== id) return s
        return { ...s, label: label }
      })
    )
  }

  changeUrl (id, url) {
    const { sources, handleChange } = this.props
    handleChange(
      sources.map(s => {
        if (s.id !== id) return s
        return { ...s, url: url }
      })
    )
  }

  removeSource (id) {
    const { sources, handleChange } = this.props
    handleChange(sources.filter(s => s.id !== id))
  }

  render () {
    const { sources } = this.props
    return (
      <Fragment>
        {sources.map(source => (
          <Source
            key={source.id}
            source={source}
            changeLabel={label => this.changeLabel(source.id, label)}
            changeUrl={url => this.changeUrl(source.id, url)}
            delete={() => this.removeSource(source.id)}
          />
        ))}
        <div
          style={{
            textAlign: 'center'
          }}
        >
          <Button
            icon="add"
            label="More sources"
            primary
            onClick={() => this.addSource()}
          />
        </div>
      </Fragment>
    )
  }
}

Sources.propTypes = {
  sources: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default Sources
