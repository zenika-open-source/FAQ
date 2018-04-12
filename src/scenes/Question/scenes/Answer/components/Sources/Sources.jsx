import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'

import Button from 'components/Button'

import Source from '../Source'

class Sources extends Component {
  addSource = () => {
    const { sources, handleChange } = this.props
    handleChange(
      sources.concat([{ id: uuid(), label: '', url: '', new: true }])
    )
  }

  changeAttribute (id, attributes) {
    const { sources, handleChange } = this.props
    handleChange(
      sources.map(s => {
        if (s.id !== id) return s
        return { ...s, ...attributes }
      })
    )
  }

  changeLabel (id, label) {
    this.changeAttribute(id, { label })
  }

  changeUrl (id, url) {
    this.changeAttribute(id, { url })
  }

  removeSource (id) {
    const { sources, handleChange } = this.props
    handleChange(sources.filter(s => s.id !== id))
  }

  render () {
    const { sources } = this.props
    return (
      <div style={{ borderTop: '1px dashed var(--secondary-color)' }}>
        {sources.length > 0 ? (
          <Fragment>
            <h3 style={{ color: 'var(--primary-color)', margin: '0.7rem' }}>
              Sources:
            </h3>
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
                link
                raised
                onClick={this.addSource}
              />
            </div>
          </Fragment>
        ) : (
          <Button
            icon="add"
            label="Add a source link"
            link
            style={{ marginTop: '0.3rem' }}
            onClick={this.addSource}
          />
        )}
      </div>
    )
  }
}

Sources.propTypes = {
  sources: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default Sources
