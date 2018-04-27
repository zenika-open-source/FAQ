import React, { Component } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'
import map from 'lodash/map'

import Button from 'components/Button'

import Tags from 'components/Tags'

import './TagPicker.css'

class TagPicker extends Component {
  state = {
    opened: false
  }

  handleClickOutside () {
    this.setState({ opened: false })
  }

  render () {
    const { tags, changeTagList } = this.props
    const { opened } = this.state

    return (
      <div className="tagpicker">
        <h3>Tags:</h3>
        <div className="tags-list">
          {tags.map(tag => (
            <div key={tag} className="tag">
              <span style={{ fontVariant: 'small-caps' }}>{tag}</span>
              <i
                className="material-icons"
                onClick={() => changeTagList('remove', tag)}
              >
                close
              </i>
            </div>
          ))}
        </div>
        <div className="picker-wrapper">
          <Button
            icon="add"
            link
            style={{ padding: 0, zIndex: 2 }}
            onClick={() => this.setState({ opened: !opened })}
          />
          <div className="picker" style={{ display: opened ? 'flex' : 'none' }}>
            <div className="picker-body">
              {map(Tags.list, (category, name) => {
                return (
                  <div key={name} className="category">
                    {/* <span className="category-name">{name}</span> */}
                    {category.map(tag => {
                      return (
                        <div
                          key={tag}
                          className="category-item"
                          onClick={() => changeTagList('add', tag)}
                          disabled={tags.indexOf(tag) > -1}
                        >
                          {tag}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TagPicker.propTypes = {
  tags: PropTypes.array.isRequired,
  changeTagList: PropTypes.func.isRequired
}

export default onClickOutside(TagPicker)
