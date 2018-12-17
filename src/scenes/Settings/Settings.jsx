import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { onListChange } from 'helpers'
import { alert, configuration } from 'services'

import { PairInputList, Button } from 'components'
import Card, { CardTitle, CardText, CardActions } from 'components/Card'

class Settings extends Component {
  constructor(props) {
    super(props)

    const { configuration } = props

    this.state = {
      loading: false,
      tags: this.tagsToList(configuration.tags),
      synonyms: this.synonymsToList(configuration.algoliaSynonyms)
    }
  }

  tagsToList(tags) {
    return Object.entries(tags || {}).map(([key, value], id) => ({
      id,
      key,
      value: value.join(', ')
    }))
  }

  listToTags(list) {
    return list.reduce((acc, item) => {
      acc[item.key] = item.value.split(',').map(x => x.trim())
      return acc
    }, {})
  }

  synonymsToList(synonyms) {
    return (synonyms || []).map(({ objectID, synonyms }, id) => ({
      id,
      key: objectID,
      value: synonyms.join(', ')
    }))
  }

  listToSynonyms(list) {
    return list.map(item => ({
      objectID: item.key,
      type: 'synonym',
      synonyms: item.value.split(',').map(x => x.trim())
    }))
  }

  onTagsChange = onListChange(this.setState.bind(this), 'tags')
  onSynonymsChange = onListChange(this.setState.bind(this), 'synonyms')

  onSave = () => {
    const { tags, synonyms } = this.state
    this.setState({ loading: true })
    this.props
      .updateConfiguration({
        tags: this.listToTags(tags),
        synonyms: this.listToSynonyms(synonyms)
      })
      .then(() => {
        alert.pushSuccess('The answer was successfully edited!')
        configuration.load()
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
        this.setState({ loading: false })
      })
  }

  render() {
    const { loading, tags, synonyms } = this.state
    return (
      <div>
        <Card>
          <CardTitle>
            <h1>FAQ Settings</h1>
          </CardTitle>
          <CardText>
            <h2>Tags</h2>
            <br />
            <PairInputList
              pairs={tags}
              options={{
                icons: { line: 'local_offer', value: 'list' },
                labels: {
                  add: 'Add tags',
                  more: 'More tags',
                  key: 'Category',
                  value: 'Tags'
                }
              }}
              actions={this.onTagsChange.actions}
              disabled={loading}
            />
            <hr />
            <h2>Synonyms</h2>
            <br />
            <PairInputList
              pairs={synonyms}
              options={{
                icons: { line: 'loop', value: 'list' },
                labels: {
                  add: 'Add a synonym',
                  more: 'More synonyms',
                  key: 'ID',
                  value: 'Synonyms'
                }
              }}
              actions={this.onSynonymsChange.actions}
              disabled={loading}
            />
            <hr />
          </CardText>
          <CardActions>
            <Button primary label="Save" onClick={this.onSave} loading={loading} />
          </CardActions>
        </Card>
      </div>
    )
  }
}

Settings.propTypes = {
  configuration: PropTypes.object.isRequired,
  updateConfiguration: PropTypes.func.isRequired
}

export default Settings
