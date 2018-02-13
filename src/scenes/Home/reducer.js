import { flow, set } from 'immutadot'

import { reducer as dataReducer } from './data/reducer'

import { SEARCH, CLEAR_SEARCH } from './actions'

const initialState = {
  text: ''
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case SEARCH:
    return flow(
      set('text', action.text),
      set('data', dataReducer(state.data, action))
    )(state)
  case CLEAR_SEARCH:
    return flow(
      set('text', ''),
      set('data', dataReducer(state.data, action))
    )(state)
  default:
    return set(state, 'data', dataReducer(state.data, action))
  }
}
