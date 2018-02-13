import { combineReducers } from 'redux'

import { reducer as authReducer } from './auth/reducer'
import { reducer as questionsReducer } from './questions/reducer'

export const reducer = combineReducers({
  auth: authReducer,
  questions: questionsReducer
})
