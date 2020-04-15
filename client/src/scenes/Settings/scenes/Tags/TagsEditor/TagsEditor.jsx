import React, { useState, useEffect, useCallback } from 'react'
import cn from 'classnames'
import sortBy from 'lodash/sortBy'
import uuid from 'uuid/v4'

import { useClickOutside } from 'helpers'
import { Input, Icon, Button, CtrlEnter, Card } from 'components'

import './TagsEditor.scss'

const TagInput = ({ changeOrder, value, onChange, onDelete }) => {
  const [newValue, setNewValue] = useState()
  const [editing, setEditing] = useState(false)
  const ref = useClickOutside(() => setEditing(false))

  useEffect(() => {
    setNewValue(value)
  }, [value])

  const validate = useCallback(() => {
    setEditing(false)
    onChange(newValue)
  }, [setEditing, onChange, newValue])

  return (
    <div ref={ref} className={cn('tag-input', { active: editing, 'with-delete': !!onDelete })}>
      <div className="tag-input-left">
        <div className={cn('order-buttons', { hidden: !editing })}>
          <Button link small onClick={changeOrder(-1)} icon="arrow_drop_up" />
          <Button link small onClick={changeOrder(+1)} icon="arrow_drop_down" />
        </div>
        {editing ? (
          <CtrlEnter onlyEnter className="input-wrapper" onCtrlEnter={validate}>
            <Input value={newValue} onChange={e => setNewValue(e.target.value)} small autoFocus />
          </CtrlEnter>
        ) : (
          <div className="value-wrapper" onClick={() => setEditing(true)}>
            <span className="value">{value}</span>
            <Icon className="edit-action" material="edit" />
          </div>
        )}
      </div>
      {editing && (
        <div className="actions">
          <Button link small onClick={validate} icon="check" />
          {onDelete && (
            <Button
              link
              small
              onClick={() => {
                if (window.confirm('Are you sure?')) {
                  setEditing(true)
                  onDelete()
                }
              }}
              icon="delete"
            />
          )}
        </div>
      )}
    </div>
  )
}

const Category = ({ category, categories, onChange }) => {
  const changeCategoryOrder = delta => () => {
    onChange(
      categories.map(cat => {
        if (cat.order === category.order + delta) return { ...cat, order: cat.order - delta }
        if (cat.order === category.order) return { ...cat, order: cat.order + delta }
        return cat
      })
    )
  }

  const changeCategoryName = name => {
    onChange(
      categories.map(cat => {
        if (cat.id !== category.id) return cat
        return { ...cat, name }
      })
    )
  }

  const deleteCategory = () => onChange(categories.filter(cat => cat.id !== category.id))

  const addLabel = () =>
    onChange(
      categories.map(cat => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: [
            ...cat.labels,
            {
              id: uuid(),
              name: 'New tag',
              order: cat.labels.length
            }
          ]
        }
      })
    )

  const deleteLabel = label => () =>
    onChange(
      categories.map(cat => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: cat.labels.filter(lab => lab.id !== label.id)
        }
      })
    )

  const changeLabelOrder = label => delta => () =>
    onChange(
      categories.map(cat => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: cat.labels.map(lab => {
            if (lab.order === label.order + delta) return { ...lab, order: lab.order - delta }
            if (lab.order === label.order) return { ...lab, order: lab.order + delta }
            return lab
          })
        }
      })
    )

  const changeLabelName = label => name =>
    onChange(
      categories.map(cat => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: cat.labels.map(lab => {
            if (lab.id !== label.id) return lab
            return { ...lab, name }
          })
        }
      })
    )

  return (
    <Card>
      <Card.Title>
        <>
          <TagInput
            changeOrder={changeCategoryOrder}
            value={category.name}
            onChange={changeCategoryName}
          />
        </>
      </Card.Title>
      <Card.Text>
        <div className="labels">
          {sortBy(category.labels, ['order']).map(label => (
            <div className="label" key={label.id}>
              <TagInput
                changeOrder={changeLabelOrder(label)}
                value={label.name}
                onChange={changeLabelName(label)}
                onDelete={deleteLabel(label)}
              />
            </div>
          ))}
        </div>
      </Card.Text>
      <Card.Actions>
        <Button link raised small icon="add" label="Add a tag" onClick={addLabel} />
        <Button
          link
          raised
          small
          icon="delete"
          label="Delete this category"
          onClick={() => window.confirm('Are you sure?') && deleteCategory()}
        />
      </Card.Actions>
    </Card>
  )
}

const TagsEditor = ({ categories, onChange }) => {
  const addCategory = () =>
    onChange([
      ...categories,
      {
        id: uuid(),
        name: 'New category',
        order: categories.length,
        labels: []
      }
    ])

  const fillerCount = 3 - ((categories.length + 1) % 3)

  return (
    <div className="tags-editor">
      {sortBy(categories, ['order']).map(category => (
        <Category
          key={category.id}
          category={category}
          categories={categories}
          onChange={onChange}
        />
      ))}
      <div className="card empty-card">
        <Button link raised icon="add" label="Add a category" onClick={addCategory} />
      </div>
      {[...new Array(fillerCount === 3 ? 0 : fillerCount)].map((_, key) => (
        <div key={key} className="card filler-card" />
      ))}
    </div>
  )
}

export default TagsEditor
