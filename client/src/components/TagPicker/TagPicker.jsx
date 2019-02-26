import React, { useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import map from 'lodash/map'

import { useConfiguration } from 'contexts'

import { useClickOutside } from 'helpers'

import { Button } from 'components'

import './TagPicker.css'

const TagPicker = ({ label, icon, tags, onChange }) => {
  const conf = useConfiguration()
  const [opened, setOpened] = useState(false)
  const ref = useClickOutside(() => setOpened(false))

  const tagList = conf ? conf.tags : {}

  return (
    <div className="tagpicker">
      <h3>{label || 'Tags:'}</h3>
      <div className="tags-list">
        {tags.map(tag => (
          <div key={tag} className="tag">
            <span style={{ fontVariant: 'small-caps', paddingBottom: '1px' }}>{tag}</span>
            <i className="material-icons" onClick={() => onChange(tags.filter(t => t !== tag))}>
              close
            </i>
          </div>
        ))}
      </div>
      <div className="picker-wrapper">
        <Button
          icon={icon || 'add'}
          link
          style={{ padding: 0 }}
          onClick={() => setOpened(op => !op)}
        />
        <div ref={ref} className="picker" style={{ display: opened ? 'flex' : 'none' }}>
          <div className="picker-body">
            {map(tagList, (category, name) => (
              <div key={name} className="category">
                {category.map(tag => {
                  const isSelected = tags.includes(tag)
                  return (
                    <div
                      key={tag}
                      className={cn('category-item', {
                        selected: isSelected
                      })}
                      onClick={() =>
                        onChange(isSelected ? tags.filter(t => t !== tag) : [...tags, tag])
                      }
                    >
                      {tag}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

TagPicker.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  tags: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default TagPicker
