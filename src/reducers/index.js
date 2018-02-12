import { combineReducers } from 'redux'

import auth from './auth'
import questions from './questions'
import search from './search'

const faqApp = combineReducers({
  auth,
  questions,
  search
})

export default faqApp
