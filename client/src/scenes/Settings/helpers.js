import { isUuidV4 } from 'helpers'
import { onListChangeReducer } from 'helpers/onListChange'

export const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return action.data
    case 'change_title':
      return { ...state, title: action.data }
    case 'toggle_workplace':
      return { ...state, workplaceSharing: action.data }
    case 'change_domains':
      return { ...state, authorizedDomains: action.data }
    case 'change_bug_reporting':
      return { ...state, bugReporting: action.data }
    case 'change_slack_channelhook':
      return { ...state, slackChannelHook: action.data }
    case 'change_slack_commandkey':
      return { ...state, slackCommandKey: action.data }
    case 'change_tags':
      return { ...state, tagCategories: action.data }
    default:
      return {
        ...state,
        synonyms: onListChangeReducer('synonyms')(state.synonyms, action)
      }
  }
}

export const synonymsToList = synonyms => {
  if (!synonyms) {
    return []
  }
  const actualSynonyms = Array.isArray(synonyms) ? synonyms : [synonyms]
  return actualSynonyms.map(({ objectID, synonyms }, id) => ({
    id,
    key: objectID,
    value: synonyms.join(', ')
  }))
}

export const listToSynonyms = list =>
  list.map(item => ({
    objectID: item.key,
    type: 'synonym',
    synonyms: item.value.split(',').map(x => x.trim())
  }))

export const serializeTags = categories =>
  JSON.stringify(
    categories.map(({ id, name, order, labels }) => {
      const serializedLabels = labels.map(({ id, name, order }) => {
        if (isUuidV4(id)) {
          return { name, order }
        } else {
          return { id, name, order }
        }
      })

      if (isUuidV4(id)) {
        return { name, order, labels: serializedLabels }
      } else {
        return { id, name, order, labels: serializedLabels }
      }
    })
  )
