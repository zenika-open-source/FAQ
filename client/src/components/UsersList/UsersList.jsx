import { useQuery } from '@apollo/client'
import { Loading } from 'components'
import { useState } from 'react'
import { getIntl } from 'services'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'

import Specialist from './components/Specialist'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [userSearchText, setUserSearchText] = useState('')

  const { data: usersData, loading, refetch } = useQuery(GET_USERS)
  const { data: servicesData, loading: servicesLoading } = useQuery(GET_TAG_CATEGORIES)

  const users = usersData ? usersData.users : []
  const specialists = usersData ? usersData.users.filter((user) => user.specialties.length > 0) : []
  const services = servicesData
    ? servicesData.configuration.tagCategories.find((category) => category.name === 'services')
        ?.labels
    : null

  const regex = new RegExp(`^${userSearchText}`, `gi`)
  const userSearchResults =
    users && userSearchText ? users.filter((user) => user.name.match(regex)).slice(0, 5) : []

  if (loading || servicesLoading) return <Loading />

  return (
    <section>
      <input
        className="w-full px-2 py-1 rounded-sm border border-secondary outline-none mb-6  focus:border-primary"
        type="text"
        name="usersSearch"
        id="usersSearch"
        placeholder={intl('search')}
        value={userSearchText}
        onChange={(e) => setUserSearchText(e.target.value)}
      />
      {userSearchResults.length > 0 && (
        <div className="relative w-full z-[2]">
          <ul className="w-full m-0 py-4 absolute top-0 left-0 bg-primary-font list-none">
            {userSearchResults.map((user) => (
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
      <ul className="flex flex-col pl-0 gap-4 list-none">
        {specialists &&
          specialists.map((specialist) => (
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
    search: 'Find a user',
  },
  fr: {
    search: 'Trouver un utilisateur',
  },
}

export default UsersList
