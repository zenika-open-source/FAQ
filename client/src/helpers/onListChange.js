import uuid from 'uuid/v4'

export const onListChange = (setState, name) => {
  const actionBuilder = action => item =>
    setState(state => {
      let list = state[name]
      switch (action) {
        case 'create':
          list = [...list, { id: uuid(), key: '', value: '' }]
          break
        case 'update':
          list = list.map(x => (x.id === item.id ? item : x))
          break
        case 'delete':
          list = list.filter(x => x.id !== item.id)
          break
        default:
          return
      }
      return { [name]: list }
    })

  actionBuilder.actions = {
    create: actionBuilder('create'),
    update: actionBuilder('update'),
    delete: actionBuilder('delete')
  }

  return actionBuilder
}

export const onListChangeReducer = prefix => (state, action) => {
  switch (action.type) {
    case `${prefix}_create`:
      return [...state, { id: uuid(), key: '', value: '' }]
    case `${prefix}_update`:
      return state.map(x => (x.id === action.data.id ? action.data : x))
    case `${prefix}_delete`:
      return state.filter(x => x.id !== action.data.id)
    default:
      return state
  }
}

export const onListChangeActions = (prefix, dispatch) => ({
  create: data => dispatch({ type: `${prefix}_create`, data }),
  update: data => dispatch({ type: `${prefix}_update`, data }),
  delete: data => dispatch({ type: `${prefix}_delete`, data })
})
