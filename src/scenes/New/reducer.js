import { flow, set } from 'immutadot'

import { NEW_QUESTION, NEW_QUESTION_SAVED } from './actions'

const initialState = {
  loading: false,
  newQuestionId: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case NEW_QUESTION:
    return set(state, 'loading', true)
  case NEW_QUESTION_SAVED:
    return flow(set('loading', false), set('newQuestionId', action.id))(state)
  default:
    return state
  }
}
