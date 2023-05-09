import { useQuery } from '@apollo/react-hooks'
import { Dropdown, Loading } from 'components'
import { DropdownItem } from 'components/Dropdown'
import { useState } from 'react'
import { getIntl } from 'services'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'

import './UsersList.css'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [users, setUsers] = useState(null)
  const [services, setServices] = useState(null)
  const [results, setResults] = useState([])

  useQuery(GET_TAG_CATEGORIES, {
    onCompleted: data =>
      setServices(
        data.configuration.tagCategories.find(category => category.name === 'services').labels
      )
  })

  const { loading } = useQuery(GET_USERS, {
    onCompleted: data => {
      setUsers(data.users)
      setResults(data.users)
    }
  })

  const searchUsers = text => {
    let matches = []
    if (text.length > 0) {
      matches = users?.filter(user => {
        const regex = new RegExp(`${text}`, `gi`)
        return user.name.match(regex)
      })
      setResults(matches?.slice(0, 5))
    } else {
      setResults(users)
    }
  }

  if (loading) return <Loading />

  return (
    <section>
      <input
        className="usersSearch"
        type="text"
        name="usersSearch"
        id="usersSearch"
        placeholder={intl('search')}
        onChange={e => searchUsers(e.target.value)}
      />
      <ul className="usersList">
        {results.length > 0 ? (
          results.map(user => (
            <li key={user.id} className="userElement">
              <div className="userLeft">
                <div className="userIcon">
                  <i className="material-icons">{user.admin ? 'admin_panel_settings' : 'person'}</i>
                </div>
                <div className="userInfo">
                  <span className="userName">{user.name}</span>
                  <span className="userEmail">{user.email}</span>
                </div>
              </div>
              <div className="userRight">
                <div className="userSpecialties">
                  {user.specialties &&
                    user.specialties.map(specialty => <p key={specialty.name}>{specialty.name}</p>)}
                </div>
                <Dropdown className="userAddSpecialties" button={intl('add')}>
                  {services?.map(service => (
                    <DropdownItem key={service.id}>{service.name}</DropdownItem>
                  ))}
                </Dropdown>
              </div>
            </li>
          ))
        ) : (
          <p className="emptyUsers">{intl('empty')}</p>
        )}
      </ul>
    </section>
  )
}

UsersList.translations = {
  en: {
    search: 'Find a user',
    add: 'Add a specialty',
    empty: 'No users found'
  },
  fr: {
    search: 'Trouver un utilisateur',
    add: 'Ajouter une spécialité',
    empty: "Pas d'utilisateurs trouvés"
  }
}

export default UsersList
