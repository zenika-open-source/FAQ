import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import rootReducer from './reducers'
import logic from './logic'

const logicMiddleware = createLogicMiddleware(logic)

const middleware = applyMiddleware(logicMiddleware)

const store = createStore(rootReducer, middleware)

export default store
