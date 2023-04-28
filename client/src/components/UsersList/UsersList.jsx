import { useQuery } from '@apollo/react-hooks'
import { Dropdown, Loading } from 'components'
import { useState } from 'react'
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
  }

  const removeFilter = filter => {
    setFilters(pull([...filters], filter))
  }

  if (loading) return <Loading />

  return (
    <section>
      <Dropdown className="dropServices" button={intl('dropdown')}>
        {services?.map(service => (
          <DropdownItem onClick={() => addFilter(service.name)} key={service.id}>
            {service.name}
          </DropdownItem>
        ))}
      </Dropdown>
      <ul className="filtersList">
        {filters.map(filter => (
          <li>
            <i className="material-icons">label</i>
            <span>{filter}</span>
            <i onClick={() => removeFilter(filter)} className="material-icons">
              close
            </i>
          </li>
        ))}
      </ul>
      <ul className="usersList">
        {users?.map(user => (
          <li key={user.id} className="userElement">
            <div className="userIcon">
              <i className="material-icons">{user.admin ? 'admin_panel_settings' : 'person'}</i>
            </div>
            <div className="userInfo">
              <span className="userName">{user.name}</span>
              <span className="userEmail">{user.email}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

UsersList.translations = {
  en: {
    dropdown: 'Filter by specialities'
  },
  fr: {
    dropdown: 'Filtrer par spécialités'
  }
}

export default UsersList
