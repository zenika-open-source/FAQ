import React, { useState, useReducer, useEffect } from 'react'

import { useConfiguration, useGroups } from 'contexts'
import { alert } from 'services'
import { useMutation } from 'services/apollo'

import { Input, Checkbox, Button, Tabs, Tab, PairInputList } from 'components'
import Card, { CardTitle, CardText, CardActions } from 'components/Card'

import { onListChangeActions } from 'helpers/onListChange'

import { groupReducers, listToTags, listToSynonyms } from './helpers'

import { updateConfigurationMutation } from './queries'

import './Settings.css'

const Settings = () => {
  const conf = useConfiguration()
  const rawGroups = useGroups()

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState(conf.title)

  const [groups, dispatchGroups] = useReducer(groupReducers, null)

  useEffect(() => {
    if (rawGroups) dispatchGroups({ type: 'init', data: rawGroups })
  }, [rawGroups])

  const [, mutate] = useMutation(updateConfigurationMutation)

  const onSave = () => {
    setLoading(true)
    mutate({
      title,
      groups: groups.map(({ slug, tags, synonyms, workplaceSharing }) => ({
        slug,
        tags: listToTags(tags),
        algoliaSynonyms: listToSynonyms(synonyms),
        workplaceSharing
      }))
    })
      .then(() => {
        alert.pushSuccess('The answer was successfully edited!')
        conf.reload()
      })
      .catch(error => {
        alert.pushError(
          <>
            <p>{error.message || 'An unknown error occured.'}</p>
            <p>Please, refresh and try again</p>
          </>,
          error
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <Card>
        <CardTitle>
          <h1 className="centered" style={{ width: '100%' }}>
            Organization and Groups Settings
          </h1>
        </CardTitle>
        <CardText>
          <h2>Organization</h2>
          <br />
          <div className="title-input">
            <i className="material-icons">home</i>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          </div>
          <br />
          <hr />
          <h2>Groups</h2>
          {groups && (
            <Tabs
              labels={groups.reduce((acc, { id, name }) => {
                acc[id] = name
                return acc
              }, {})}
            >
              {groups.map(group => (
                <Tab key={group.id} id={group.id}>
                  <h3>Tags</h3>
                  <br />
                  <PairInputList
                    pairs={group.tags}
                    options={{
                      icons: { line: 'local_offer', value: 'list' },
                      labels: {
                        add: 'Add tags',
                        more: 'More tags',
                        key: 'Category',
                        value: 'Tags'
                      }
                    }}
                    actions={onListChangeActions('tags', dispatchGroups, { groupId: group.id })}
                    disabled={loading}
                  />
                  <hr />
                  <h3>Synonyms</h3>
                  <br />
                  <PairInputList
                    pairs={group.synonyms}
                    options={{
                      icons: { line: 'loop', value: 'list' },
                      labels: {
                        add: 'Add a synonym',
                        more: 'More synonyms',
                        key: 'ID',
                        value: 'Synonyms'
                      }
                    }}
                    actions={onListChangeActions('synonyms', dispatchGroups, { groupId: group.id })}
                    disabled={loading}
                  />
                  <hr />
                  <h3>Integrations</h3>
                  <br />
                  <div style={{ marginLeft: '1rem' }}>
                    <Checkbox
                      label="Enable workplace sharing"
                      checked={group.workplaceSharing}
                      onChange={e =>
                        dispatchGroups({
                          type: 'toggle_workplace',
                          id: group.id,
                          data: e.target.checked
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <br />
                </Tab>
              ))}
            </Tabs>
          )}
        </CardText>
        <CardActions>
          <Button primary label="Save" onClick={onSave} loading={loading} />
        </CardActions>
      </Card>
    </div>
  )
}

export default Settings
