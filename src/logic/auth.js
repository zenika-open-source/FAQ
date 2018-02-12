import { createLogic } from 'redux-logic'
import { LOGIN } from 'constants/ActionTypes'
import { loginSuccessful, loginError } from 'actions'

const login = createLogic({
  type: LOGIN,

  validate ({ getState, action }, allow, reject) {
    // If not auth yet and user password is "password"
    if (getState().auth.user == null && action.user.password === 'password') {
      allow(loginSuccessful(action.user))
    } else {
      reject(loginError('Error while signing in'))
    }
  }
})

export default [login]
