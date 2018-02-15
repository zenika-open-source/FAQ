import { SAVE_QUESTION } from './actions'

import questions from 'questions.json'

const initialState = questions

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case SAVE_QUESTION:
    return [...state, action.question]
  default:
    return state
  }
}
