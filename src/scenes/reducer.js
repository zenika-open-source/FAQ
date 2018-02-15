import { combineReducers } from 'redux'

import { reducer as authReducer } from './Auth/reducer'
import { reducer as homeReducer } from './Home/reducer'
import { reducer as newReducer } from './New/reducer'

export const reducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  new: newReducer
})
