import { onListChangeReducer } from 'helpers/onListChange'

export const reducer = (state, action) => {
  switch (action.type) {
    case 'change_title':
      return { ...state, title: action.data }
    case 'toggle_workplace':
      return { ...state, workplaceSharing: action.data }
    default:
      return {
        ...state,
        tags: onListChangeReducer('tags')(state.tags, action),
        synonyms: onListChangeReducer('synonyms')(state.synonyms, action)
      }
  }
}

export const tagsToList = tags =>
  Object.entries(tags || {}).map(([key, value], id) => ({
    id,
    key,
    value: value.join(', ')
  }))

export const listToTags = list =>
  list.reduce((acc, item) => {
    acc[item.key] = item.value.split(',').map(x => x.trim())
    return acc
  }, {})

export const synonymsToList = synonyms =>
  (synonyms || []).map(({ objectID, synonyms }, id) => ({
    id,
    key: objectID,
    value: synonyms.join(', ')
  }))

export const listToSynonyms = list =>
  list.map(item => ({
    objectID: item.key,
    type: 'synonym',
    synonyms: item.value.split(',').map(x => x.trim())
  }))
