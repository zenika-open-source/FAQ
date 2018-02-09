import { set } from 'immutadot'

import * as types from 'constants/ActionTypes'

const initialState = {
  text: ''
}

const search = (state = initialState, action) => {
  switch (action.type) {
  case types.SEARCH:
    return set(state, 'text', action.text)
  case types.CLEAR_SEARCH:
    return set(state, 'text', action.text)
  default:
    return state
  }
}

export default search
