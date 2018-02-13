export const SEARCH = 'SEARCH'
export const CLEAR_SEARCH = 'CLEAR_SEARCH'

export const search = text => ({ type: SEARCH, text })
export const clearSearch = () => ({ type: CLEAR_SEARCH })
