import cn from 'classnames'
import sortBy from 'lodash/sortBy'
import { useEffect, useState } from 'react'
import uuid from 'uuid/v4'

import { Button, Icon, Input } from 'components'
import Card, { CardActions, CardText, CardTitle } from 'components/Card'
import { useClickOutside } from 'helpers'

const TagInput = ({ changeOrder, value, onChange, onDelete }) => {
  const [newValue, setNewValue] = useState()
  const [editing, setEditing] = useState(false)
  const ref = useClickOutside(() => setEditing(false))

  useEffect(() => {
    setNewValue(value)
  }, [value])

  return (
    <div
      ref={ref}
      className={cn('flex flex-1 items-center my-1 min-h-[1.2rem] justify-between', {
        '-ml-[10px]': editing,
        '[&_input]:w-[100px]': !onDelete,
      })}
    >
      <div className="flex flex-nowrap items-center flex-1">
        <div className={cn('flex flex-col mx-1', { 'hidden h-[10px]': !editing })}>
          <Button intent="link" size="small" onClick={changeOrder(-1)} icon="arrow_drop_up" />
          <Button intent="link" size="small" onClick={changeOrder(+1)} icon="arrow_drop_down" />
        </div>
        {editing ? (
          <div className="[&_input]:w-20">
            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} small autoFocus />
          </div>
        ) : (
          <div
            className="flex items-center ml-3 cursor-pointer flex-1 justify-between capitalize"
            onClick={() => setEditing(true)}
          >
            <span className="lowercase text-lg" style={{ fontVariant: 'small-caps' }}>
              {value}
            </span>
            <Icon className="text-lg" material="edit" />
          </div>
        )}
      </div>
      {editing && (
        <div className="ml-2 -mb-[2px] flex flex-nowrap [&_i]:text-lg">
          <Button
            intent="link"
            size="small"
            onClick={() => {
              setEditing(false)
              onChange(newValue)
            }}
            icon="check"
          />
          {onDelete && (
            <Button
              intent="link"
              size="small"
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
  const changeCategoryOrder = (delta) => () => {
    onChange(
      categories.map((cat) => {
        if (cat.order === category.order + delta) return { ...cat, order: cat.order - delta }
        if (cat.order === category.order) return { ...cat, order: cat.order + delta }
        return cat
      }),
    )
  }

  const changeCategoryName = (name) => {
    onChange(
      categories.map((cat) => {
        if (cat.id !== category.id) return cat
        return { ...cat, name }
      }),
    )
  }

  const deleteCategory = () => onChange(categories.filter((cat) => cat.id !== category.id))

  const addLabel = () =>
    onChange(
      categories.map((cat) => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: [
            ...cat.labels,
            {
              id: uuid(),
              name: 'New tag',
              order: cat.labels.length,
            },
          ],
        }
      }),
    )

  const deleteLabel = (label) => () =>
    onChange(
      categories.map((cat) => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: cat.labels.filter((lab) => lab.id !== label.id),
        }
      }),
    )

  const changeLabelOrder = (label) => (delta) => () =>
    onChange(
      categories.map((cat) => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: cat.labels.map((lab) => {
            if (lab.order === label.order + delta) return { ...lab, order: lab.order - delta }
            if (lab.order === label.order) return { ...lab, order: lab.order + delta }
            return lab
          }),
        }
      }),
    )

  const changeLabelName = (label) => (name) =>
    onChange(
      categories.map((cat) => {
        if (cat.id !== category.id) return cat
        return {
          ...cat,
          labels: cat.labels.map((lab) => {
            if (lab.id !== label.id) return lab
            return { ...lab, name }
          }),
        }
      }),
    )

  return (
    <Card>
      <CardTitle>
        <>
          <TagInput
            changeOrder={changeCategoryOrder}
            value={category.name}
            onChange={changeCategoryName}
          />
        </>
      </CardTitle>
      <CardText className="flex flex-col flex-1">
        <div>
          {sortBy(category.labels, ['order']).map((label) => (
            <div className="border-b border-dotted border-b-secondary-dark" key={label.id}>
              <TagInput
                changeOrder={changeLabelOrder(label)}
                value={label.name}
                onChange={changeLabelName(label)}
                onDelete={deleteLabel(label)}
              />
            </div>
          ))}
        </div>
      </CardText>
      <CardActions className="flex justify-center flex-wrap mb-2">
        <Button
          className="mr-1"
          intent="primary"
          action="raised"
          size="medium"
          icon="add"
          label="Add a tag"
          onClick={addLabel}
        />
        <Button
          intent="link"
          action="raised"
          size="medium"
          icon="delete"
          label="Delete this category"
          onClick={() => window.confirm('Are you sure?') && deleteCategory()}
        />
      </CardActions>
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
        labels: [],
      },
    ])

  const fillerCount = 3 - ((categories.length + 1) % 3)

  return (
    <div className="flex flex-wrap">
      {sortBy(categories, ['order']).map((category) => (
        <Category
          key={category.id}
          category={category}
          categories={categories}
          onChange={onChange}
        />
      ))}
      <div className="flex-1 min-w-[220px] flex flex-col my-2 mx-[1%] border border-dashed rounded-lg items-center justify-center min-h-[150px]">
        <Button
          intent="link"
          action="raised"
          size="medium"
          icon="add"
          label="Add a category"
          onClick={addCategory}
        />
      </div>
      {[...new Array(fillerCount === 3 ? 0 : fillerCount)].map((_, key) => (
        <div key={key} className="flex-1 min-w-[220px] flex flex-col my-2 mx-[1%] border-none" />
      ))}
    </div>
  )
}

export default TagsEditor
