import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogicMiddleware } from 'redux-logic'

import { reducer as dataReducer } from 'data/reducer'
import { reducer as scenesReducer } from 'scenes/reducer'

import { logic as dataLogic } from 'data/logic'
import { logic as scenesLogic } from 'scenes/logic'

/* ROOT REDUCER */
const rootReducer = combineReducers({
  data: dataReducer,
  scenes: scenesReducer
})

/* ROOT LOGIC */
const rootLogic = [...dataLogic, ...scenesLogic]
const logicMiddleware = createLogicMiddleware(rootLogic)
const middleware = applyMiddleware(logicMiddleware)

/* STORE */
const store = createStore(rootReducer, middleware)

export default store
