import * as types from 'constants/ActionTypes'

export const search = text => ({ type: types.SEARCH, text })
export const clearSearch = () => ({ type: types.CLEAR_SEARCH })
export const filterQuestions = filtered => ({
  type: types.FILTER_QUESTIONS,
  filtered
})

export const login = user => ({ type: types.LOGIN, user })
export const loginSuccessful = user => ({ type: types.LOGIN_SUCCESSFUL, user })
export const loginError = error => ({ type: types.LOGIN_ERROR, error })
export const logout = () => ({ type: types.LOGOUT })
