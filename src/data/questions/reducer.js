import { SAVE_QUESTION } from './actions'

import questions from 'questions.json'

const initialState = questions.reverse()

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case SAVE_QUESTION:
    return [action.question, ...state]
  default:
    return state
  }
}
