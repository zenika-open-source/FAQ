import { FILTER_QUESTIONS } from './actions'

const initialState = []

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case FILTER_QUESTIONS:
    return action.filtered
  default:
    return state
  }
}
