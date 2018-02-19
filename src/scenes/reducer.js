import { combineReducers } from 'redux'

import { reducer as authReducer } from './Auth/reducer'

export const reducer = combineReducers({
  auth: authReducer
})
