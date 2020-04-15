import React, { useContext, useState, useEffect } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'

import firebase, { googleProvider } from './firebase'
import { apollo } from './apollo'
import { alert } from './alert'

export const useUser = () => {
  const auth = useAuth()

  const [query, { data }] = useLazyQuery(gql`
    query {
      me {
        id
        name
        admin
        email
        picture
      }
    }
  `)

  useEffect(() => {
    if (auth.ready && (auth.user || auth.wasAuth)) {
      query()
    }
  }, [query, auth])

  return data?.me
}

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setState] = useState({ ready: false, user: null, wasAuth: false })
  const [mutate] = useMutation(gql`
    mutation($idToken: String!) {
      authenticate(idToken: $idToken) {
        id
        name
        admin
        email
        picture
      }
    }
  `)

  // TODO: Use custom flow for multi-tenancy
  // login on [tenant].faq.team redirects to faq.team/auth
  // faq.team/auth does classical firebase auth
  // faq.team/auth redirects to [tenant].faq.team with the id & refresh tokens
  // [tenant].faq.team refreshes id token indefinitely by asking the backend
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const idToken = await user.getIdToken()
        localStorage.idToken = idToken
        try {
          // Only authenticate if signin in, not for refreshing
          if (!localStorage.getItem('configuration')) {
            await mutate({ variables: { idToken } })
          }
          setState(prev => ({ ready: true, user, wasAuth: !!prev.user }))
        } catch (err) {
          if (err.networkError) {
            alert.pushDefaultError(err.networkError)
          } else {
            alert.pushError('Authentication failed: ' + JSON.stringify(err.message), err)
          }
          signOut()
        }
      } else {
        setState(prev => ({ ready: true, user, wasAuth: !!prev.user }))
      }
    })

    return unsubscribe
  }, [mutate])

  // Refresh token every 50min
  /*useEffect(() => {
    // TODO: Bug if opening app 1min before expiration
    const interval = setInterval(async () => {
      const idToken = await firebase.auth().currentUser.getIdToken(true)
      localStorage.idToken = idToken
    }, 50 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])*/

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export const signIn = () => {
  firebase
    .auth()
    .signInWithPopup(googleProvider)
    .catch(error => {
      console.log(error)
    })
}

export const signOut = async () => {
  await apollo.clearStore()
  localStorage.removeItem('apollo-cache-persist')
  localStorage.removeItem('idToken')
  localStorage.removeItem('configuration')
  await firebase.auth().signOut()
}
