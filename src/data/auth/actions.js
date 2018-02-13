export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGOUT = 'LOGIN'

export const login = user => ({ type: LOGIN, user })
export const loginSuccessful = user => ({ type: LOGIN_SUCCESSFUL, user })
export const loginError = error => ({ type: LOGIN_ERROR, error })
export const logout = () => ({ type: LOGOUT })
