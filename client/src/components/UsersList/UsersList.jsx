import { useQuery } from '@apollo/react-hooks'
import { Loading } from 'components'
import { useState } from 'react'
import { getIntl } from 'services'
import { GET_USERS } from './queries'

import './UsersList.css'
import Specialist from './components/Specialist'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [userSearchText, setUserSearchText] = useState('')
  const [userSearchResults, setUserSearchResults] = useState([])

  const { data: usersData, loading, refetch } = useQuery(GET_USERS)

  const users = usersData ? usersData.users : []
  const specialists = usersData ? usersData.users.filter(user => user.specialties.length > 0) : []

  const searchUsers = text => {
    let matches = []
    setUserSearchText(text)
    if (text.length > 0 && users) {
      const regex = new RegExp(`^${text}`, `gi`)
      matches = users.filter(user => user.name.match(regex)).slice(0, 5)
    }
    setUserSearchResults(matches)
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
        value={userSearchText}
        onChange={e => searchUsers(e.target.value)}
      />
      {userSearchResults.length > 0 && (
        <div className="resultsContainer">
          <ul className="usersList">
            {userSearchResults.map(user => (
              <Specialist specialist={user} key={user.id} onUpdateSpecialty={refetch} />
            ))}
          </ul>
        </div>
      )}
      <ul className="usersList">
        {specialists &&
          specialists.map(specialist => (
            <Specialist specialist={specialist} key={specialist.id} onUpdateSpecialty={refetch} />
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
