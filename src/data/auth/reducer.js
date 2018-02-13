import { set } from 'immutadot'
import { LOGIN_SUCCESSFUL, LOGIN_ERROR, LOGOUT } from './actions'

const initialState = {
  user: null,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case LOGIN_SUCCESSFUL:
    return set(state, 'user', action.user)
  case LOGIN_ERROR:
    return set(state, 'error', action.error)
  case LOGOUT:
    return set(state, 'user', null)
  default:
    return state
  }
}
