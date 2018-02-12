import * as types from 'constants/ActionTypes'

export const search = text => ({ type: types.SEARCH, text })
export const clearSearch = () => ({ type: types.CLEAR_SEARCH })

export const login = user => ({ type: types.LOGIN, user })
export const logout = () => ({ type: types.LOGOUT })
