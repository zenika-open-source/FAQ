import { USER_LOADED } from './actions'

const initialState = null

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case USER_LOADED:
    return action.user
  default:
    return state
  }
}
