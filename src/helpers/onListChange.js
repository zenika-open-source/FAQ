import uuid from 'uuid/v4'

const onListChange = (setState, name) => {
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

export default onListChange
