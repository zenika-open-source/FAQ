import { useQuery } from '@apollo/react-hooks'
import { Loading } from 'components'
import { useState } from 'react'
import { getIntl } from 'services'
import { GET_TAG_CATEGORIES, GET_USERS } from './queries'

import './UsersList.css'
import Specialist from './components/Specialist'
import SpecialtiesList from './components/SpecialtiesList'

const UsersList = () => {
  const intl = getIntl(UsersList)

  const [users, setUsers] = useState(null)
  const [specialists, setSpecialists] = useState(null)
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
      setSpecialists(data.users.filter(user => user.specialties.length > 0))
    }
  })

  const searchUsers = text => {
    let matches = []
    if (text.length > 0) {
      matches =
        results &&
        users?.filter(user => {
          const regex = new RegExp(`^${text}`, `gi`)
          return user.name.match(regex)
        })
      setResults(matches?.slice(0, 5))
    } else {
      setResults([])
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
      {results.length > 0 && (
        <div className="resultsContainer">
          <ul className="resultsList">
            {results.map(result => (
              <li className="resultsEl" key={result.id}>
                <p className="resultName">{result.name}</p>
                <div className="userRight">
                  <div className="userSpecialties">
                    {result?.specialties.length > 0 &&
                      result.specialties.map(specialty => (
                        <div key={specialty.name} className="userSpecialty">
                          <span>{specialty.name}</span>
                          <i className="material-icons">close</i>
                        </div>
                      ))}
                  </div>
                  <SpecialtiesList services={services} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="usersList">
        {specialists &&
          specialists.map(specialist => <Specialist services={services} specialist={specialist} />)}
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
