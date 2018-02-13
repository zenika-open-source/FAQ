import { combineReducers } from 'redux'

import { reducer as filteredReducer } from './filtered/reducer'

export const reducer = combineReducers({
  filtered: filteredReducer
})
