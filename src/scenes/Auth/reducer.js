import { set } from 'immutadot'

import { LOGIN_ERROR } from './actions'

const initialState = {
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case LOGIN_ERROR:
    return set(state, 'error', action.error)
  default:
    return state
  }
}
