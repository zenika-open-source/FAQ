import { gql, useLazyQuery } from '@apollo/client'
import { useAuth } from './auth'
import { useEffect } from 'react'

export const useConfiguration = ({ cacheOnly } = { cacheOnly: false }) => {
  const auth = useAuth()

  const [query, { data }] = useLazyQuery(
    gql`
      query {
        configuration {
          id
          title
          workplaceSharing
          bugReporting
          tagCategories {
            id
            name
            order
            labels {
              id
              name
              order
            }
          }
        }
      }
    `,
    {
      fetchPolicy: cacheOnly ? 'cache-only' : 'cache-and-network',
      // Ultra-fast cache for configuration
      onCompleted: data => localStorage.setItem('configuration', JSON.stringify(data.configuration))
    }
  )

  useEffect(() => {
    if (auth.ready && (auth.user || auth.wasAuth)) {
      query()
    }
  }, [query, auth])

  return data?.configuration || JSON.parse(localStorage.getItem('configuration')) || {}
}
