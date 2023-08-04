import sortBy from 'lodash/sortBy'
import PropTypes from 'prop-types'
import { useState } from 'react'

import { useConfiguration } from 'contexts'

import { useClickOutside } from 'helpers'

import { Button } from 'components'

import './TagPicker.css'

const TagPicker = ({ label, icon, tags, onChange }) => {
  const conf = useConfiguration()
  const [opened, setOpened] = useState(false)
  const ref = useClickOutside(() => setOpened(false))

  const tagCategories = conf ? conf.tagCategories : []

  return (
    <div className="flex items-center">
      <h3 className="text-primary">{label || 'Tags:'}</h3>
      <div className="flex items-center ml-[0.6rem] flex-wrap">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-primary-light text-primary-font leading-3 p-1 pt-0 rounded text-base flex items-center my-[0.1rem] mr-[0.4rem]"
          >
            <span className="pb-px" style={{ fontVariant: 'small-caps' }}>
              {tag.name.toLowerCase()}
            </span>
            <i
              className="material-icons text-sm ml-1 -mb-1 cursor-pointer hover:font-bold"
              onClick={() => onChange(tags.filter((t) => t.id !== tag.id))}
            >
              close
            </i>
          </div>
        ))}
      </div>
      <div className="relative flex items-center justify-center">
        <Button
          icon={icon || 'add'}
          intent="link"
          className="px-0 py-0"
          onClick={() => setOpened((op) => !op)}
        />
        <div
          ref={ref}
          className={`absolute border border-secondary-dark bg-secondary-light -top-[10px] -right-[180px] w-[170px] h-[240px] rounded py-[0.1rem] z-[9] before:content-[''] before:block before:absolute before:w-0 before:h-0 before:border-solid before:top-[10.75px] before:border-transparent before:border-r-secondary-dark before:border-[10.5px] before:-left-[20px] after:content-[''] after:block after:absolute after:w-0 after:h-0 after:border-solid after:top-[11px] after:border-transparent after:border-r-secondary-light after:border-[10px] after:-left-[19px] ${
            opened ? 'flex' : 'hidden'
          }`}
        >
          <div className="h-full w-full p-1 overflow-y-scroll flex flex-col">
            {sortBy(tagCategories, ['order']).map((category) => (
              <div key={category.name} className="">
                {sortBy(category.labels, ['order']).map((label) => {
                  const isSelected = !!tags.find((t) => t.id === label.id)
                  return (
                    <div
                      key={label.name}
                      style={{ fontVariant: 'small-caps' }}
                      className={`p-[0.3rem] pt-[0.1rem] cursor-pointer hover:bg-secondary text-secondary-font-dark ${
                        isSelected
                          ? "before:content-['✓'] hover:mr-1 before:hover:content-['✕'] before:hover:mr-1"
                          : ''
                      }`}
                      onClick={() =>
                        onChange(
                          isSelected ? tags.filter((t) => t.id !== label.id) : [...tags, label],
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

TagPicker.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  tags: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default TagPicker
