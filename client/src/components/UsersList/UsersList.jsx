import { useQuery } from '@apollo/react-hooks'
import { List, Loading } from 'components'
import { useEffect, useState } from 'react'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'
import { ListItem } from 'components/List'

import './UsersList.css'

const UsersList = () => {
  const [users, setUsers] = useState(null)

  //   const { data } = useQuery(GET_TAG_CATEGORIES)
  //   console.log(data.configuration.tagCategories.find(category => category.name === 'services'))
  const { data, loading } = useQuery(GET_USERS, {
    onCompleted: data => setUsers(data.users)
  })

  console.log(users)

  if (loading) return <Loading />

  return (
    <ul className="usersList">
      {users?.map(user => (
        <li key={user.id} className="userElement">
          <div style={{ marginRight: '1rem' }}>
            <i className="material-icons">{user.admin ? 'admin_panel_settings' : 'person'}</i>
          </div>
          <div className="userInfo">
            <p className="userName">{user.name}</p>
            <p className="userEmail">{user.email}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default UsersList
