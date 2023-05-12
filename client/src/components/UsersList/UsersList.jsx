import { useQuery } from '@apollo/react-hooks'
import { Loading } from 'components'
import { useEffect, useState } from 'react'
import { getIntl } from 'services'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'

import './UsersList.css'
import Specialist from './components/Specialist'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [users, setUsers] = useState(null)
  const [specialists, setSpecialists] = useState(null)
  const [services, setServices] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState([])

  useQuery(GET_TAG_CATEGORIES, {
    onCompleted: data =>
      setServices(
        data.configuration.tagCategories.find(category => category.name === 'services').labels
      )
  })

  const { loading } = useQuery(GET_USERS, {
    onCompleted: data => {
      setUsers(data.users)
      setSpecialists(data.users.filter(user => user.specialties.length > 0))
    }
  })

  const searchUsers = text => {
    let matches = []
    if (text.length > 0) {
      matches = users?.filter(user => {
        const regex = new RegExp(`^${text}`, `gi`)
        return user.name.match(regex)
      })
      setFilteredUsers(matches?.slice(0, 5))
    } else {
      setFilteredUsers([])
    }
  }

  useEffect(() => {
    setSpecialists(specialists)
  }, [specialists])

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
      {filteredUsers.length > 0 && (
        <div className="resultsContainer">
          <ul className="usersList">
            {filteredUsers.map(user => (
              <Specialist services={services} specialist={user} key={user.id} />
            ))}
          </ul>
        </div>
      )}
      <ul className="usersList">
        {specialists &&
          specialists.map(specialist => (
            <Specialist services={services} specialist={specialist} key={specialist.id} />
          ))}
      </ul>
    </section>
  )
}

UsersList.translations = {
  en: {
    search: 'Find a user'
  },
  fr: {
    search: 'Trouver un utilisateur'
  }
}

export default UsersList
