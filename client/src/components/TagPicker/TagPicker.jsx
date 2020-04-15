import React, { useState } from 'react'
import cn from 'classnames'
import sortBy from 'lodash/sortBy'

import { useConfiguration } from 'services'
import { useClickOutside } from 'helpers'
import { Button } from 'components'

import './TagPicker.css'

const TagPicker = ({ label, icon, tags, onChange }) => {
  const conf = useConfiguration()
  const [opened, setOpened] = useState(false)
  const ref = useClickOutside(() => setOpened(false))

  const tagCategories = conf ? conf.tagCategories : []

  return (
    <div className="tagpicker">
      <h3>{label || 'Tags:'}</h3>
      <div className="tags-list">
        {tags.map(tag => (
          <div key={tag.id} className="tag">
            <span style={{ fontVariant: 'small-caps', paddingBottom: '1px' }}>
              {tag.name.toLowerCase()}
            </span>
            <i
              className="material-icons"
              onClick={() => onChange(tags.filter(t => t.id !== tag.id))}
            >
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
            {sortBy(tagCategories, ['order']).map(category => (
              <div key={category.name} className="category">
                {sortBy(category.labels, ['order']).map(label => {
                  const isSelected = !!tags.find(t => t.id === label.id)
                  return (
                    <div
                      key={label.name}
                      className={cn('category-item', {
                        selected: isSelected
                      })}
                      onClick={() =>
                        onChange(
                          isSelected ? tags.filter(t => t.id !== label.id) : [...tags, label]
                        )
                      }
                    >
                      {label.name.toLowerCase()}
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

export default TagPicker
