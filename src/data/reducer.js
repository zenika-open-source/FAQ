import { combineReducers } from 'redux'

import { reducer as userReducer } from './user/reducer'
import { reducer as questionsReducer } from './questions/reducer'

export const reducer = combineReducers({
  user: userReducer,
  questions: questionsReducer
})
