import { useQuery } from '@apollo/react-hooks'
import { Dropdown, Loading } from 'components'
import { useEffect, useState } from 'react'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'
import { DropdownItem } from 'components/Dropdown'
import { getIntl } from 'services'
import uniqBy from 'lodash/uniqBy'
import pull from 'lodash/pull'

import './UsersList.css'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [users, setUsers] = useState(null)
  const [services, setServices] = useState(null)
  const [filters, setFilters] = useState([])

  useQuery(GET_TAG_CATEGORIES, {
    onCompleted: data =>
      setServices(
        data.configuration.tagCategories.find(category => category.name === 'services').labels
      )
  })

  const { loading } = useQuery(GET_USERS, {
    onCompleted: data => setUsers(data.users)
  })

  const addFilter = filter => {
    setFilters(uniqBy([...filters, filter]))
    console.log(filters)
  }

  const removeFilter = filter => {
    setFilters(pull([...filters], filter))
  }

  const filterUsers = filter => {
    if (users) {
      setUsers(
        users.forEach(user => {
          if (filters) {
            return (
              user.specialities &&
              user.specialities.every(speciality => speciality.name.includes(filter))
            )
          } else {
            return users
          }
        })
      )
    }
  }

  if (loading) return <Loading />

  return (
    <section>
      <Dropdown className="dropServices" button={intl('filter')}>
        {services?.map(service => (
          <DropdownItem
            onClick={() => {
              addFilter(service.name)
              filterUsers(service.name)
            }}
            key={service.id}
          >
            {service.name}
          </DropdownItem>
        ))}
      </Dropdown>
      <ul className="filtersList">
        {filters.map(filter => (
          <li>
            <i className="material-icons">label</i>
            <span>{filter}</span>
            <i
              onClick={() => {
                removeFilter(filter)
                filterUsers(filter)
              }}
              className="material-icons"
            >
              close
            </i>
          </li>
        ))}
      </ul>
      <ul className="usersList">
        {users ? (
          users.map(user => (
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
                <div className="userSpecialities">
                  {user.specialities &&
                    user.specialities.map(speciality => (
                      <p key={speciality.name}>{speciality.name}</p>
                    ))}
                </div>
                <Dropdown className="userAddSpecialities" button={intl('add')}>
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
    filter: 'Filter by specialities',
    add: 'Add a speciality',
    empty: 'No users found'
  },
  fr: {
    filter: 'Filtrer par spécialités',
    add: 'Ajouter une spécialité',
    empty: "Pas d'utilisateurs trouvés"
  }
}

export default UsersList
