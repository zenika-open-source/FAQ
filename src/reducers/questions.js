import { set } from 'immutadot'

import * as types from 'constants/ActionTypes'
import questions from 'questions.json'

const initialState = {
  questions,
  filtered: []
}

const search = (state = initialState, action) => {
  switch (action.type) {
  case types.FILTER_QUESTIONS:
    return set(state, 'filtered', action.filtered)
  default:
    return state
  }
}

export default search
