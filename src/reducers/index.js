import { combineReducers } from 'redux'

import search from './search'
import questions from './questions'

const faqApp = combineReducers({
  questions,
  search
})

export default faqApp
