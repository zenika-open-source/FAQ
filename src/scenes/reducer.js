import { combineReducers } from 'redux'

import { reducer as homeReducer } from './Home/reducer'

export const reducer = combineReducers({
  home: homeReducer
})
