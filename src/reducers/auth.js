import { set } from 'immutadot'

import * as types from 'constants/ActionTypes'

const initialState = {
  user: null,
  error: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
  case types.LOGIN_SUCCESSFUL:
    return set(state, 'user', action.user)
  case types.LOGIN_ERROR:
    return set(state, 'error', action.error)
  case types.LOGOUT:
    return set(state, 'user', null)
  default:
    return state
  }
}

export default auth
