import { set } from 'immutadot'

import * as types from 'constants/ActionTypes'

const initialState = {
  user: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
  case types.LOGIN:
    return set(state, 'user', action.user)
  case types.LOGOUT:
    return set(state, 'user', null)
  default:
    return state
  }
}

export default auth
