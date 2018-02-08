import * as types from 'constants/ActionTypes'

import questions from 'questions.json'
import Fuse from 'fuse.js'

const initialState = {
  questions,
  filtered: []
}

const fuseOptions = {
  shouldSort: true,
  includeScore: true,
  tokenize: true,
  threshold: 0.6,
  location: 0,
  distance: 10000,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ['question', 'answer']
}

const search = (state = initialState, action) => {
  switch (action.type) {
  case types.SEARCH:
    const filtered = new Fuse(state.questions, fuseOptions)
      .search(action.text)
      .filter(q => q.score < fuseOptions.threshold)
    return {
      ...state,
      filtered: filtered
    }
  case types.CLEAR_SEARCH:
    return {
      ...state,
      filtered: []
    }
  default:
    return state
  }
}

export default search
