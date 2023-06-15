import { useQuery } from '@apollo/client'
import { Loading } from 'components'
import { useState } from 'react'
import { getIntl } from 'services'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'

import './UsersList.css'
import Specialist from './components/Specialist'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [userSearchText, setUserSearchText] = useState('')

  const { data: usersData, loading, refetch } = useQuery(GET_USERS)
  const { data: servicesData, loading: servicesLoading } = useQuery(GET_TAG_CATEGORIES)

  const users = usersData ? usersData.users : []
  const specialists = usersData ? usersData.users.filter(user => user.specialties.length > 0) : []
  const services = servicesData
    ? servicesData.configuration.tagCategories.find(category => category.name === 'services')
        ?.labels
    : null

  const regex = new RegExp(`^${userSearchText}`, `gi`)
  const userSearchResults =
    users && userSearchText ? users.filter(user => user.name.match(regex)).slice(0, 5) : []

  if (loading || servicesLoading) return <Loading />

  return (
    <section>
      <input
        className="usersSearch"
        type="text"
        name="usersSearch"
        id="usersSearch"
        placeholder={intl('search')}
        value={userSearchText}
        onChange={e => setUserSearchText(e.target.value)}
      />
      {userSearchResults.length > 0 && (
        <div className="resultsContainer">
          <ul className="usersList">
            {userSearchResults.map(user => (
              <Specialist
                specialist={user}
                services={services}
                key={user.id}
                onUpdateSpecialty={refetch}
              />
            ))}
          </ul>
        </div>
      )}
      <ul className="usersList">
        {specialists &&
          specialists.map(specialist => (
            <Specialist
              specialist={specialist}
              services={services}
              key={specialist.id}
              onUpdateSpecialty={refetch}
            />
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
