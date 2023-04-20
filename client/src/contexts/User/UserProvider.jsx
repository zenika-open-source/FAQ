import React, { useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { useAuth } from '../Auth'

import { GET_ME } from './queries'

export const UserContext = React.createContext({})

const UserProvider = ({ children }) => {
  let value

  const { isAuth } = useAuth()

  const { data } = useQuery(GET_ME, { skip: !isAuth })

  value = useMemo(() => isAuth && data && data.me, [isAuth, data])

  if (process.env.REACT_APP_DISABLE_AUTH === 'true') {
    value = {
      id: 'clgosxxdj00080894xqetwi5s',
      admin: false,
      name: 'playwrightTest',
      email: 'faq-user-no-auth@zenika.com',
      picture:
        'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      __typename: 'User'
    }
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
