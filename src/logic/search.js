import { createLogic } from 'redux-logic'
import { SEARCH } from 'constants/ActionTypes'
import { filterQuestions } from 'actions'

import Fuse from 'fuse.js'

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

const search = createLogic({
  type: SEARCH,

  process ({ getState, action }) {
    const filtered = new Fuse(getState().questions.questions, fuseOptions)
      .search(action.text)
      .filter(q => q.score < fuseOptions.threshold)

    return filterQuestions(filtered)
  }
})

export default [search]
