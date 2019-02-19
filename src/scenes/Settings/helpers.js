import { onListChangeReducer } from 'helpers/onListChange'

export const groupReducers = (state, action) => {
  switch (action.type) {
    case 'init':
      return (
        state ||
        action.data.map(({ tags, algoliaSynonyms, ...rest }) => ({
          ...rest,
          tags: tagsToList(tags),
          synonyms: synonymsToList(algoliaSynonyms)
        }))
      )
    case 'toggle_workplace':
      return state.map(g => {
        if (g.id !== action.id) return g
        return { ...g, workplaceSharing: action.data }
      })
    default:
      return state.map(g => {
        if (g.id !== action.ctx.groupId) return g
        return {
          ...g,
          tags: onListChangeReducer('tags')(g.tags, action),
          synonyms: onListChangeReducer('synonyms')(g.synonyms, action)
        }
      })
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
