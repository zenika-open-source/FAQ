import { useQuery, gql, useMutation } from '@apollo/client'

import { isUuidV4 } from 'helpers'

export const initState = configuration => ({
  categories: configuration?.tagCategories,
  initial: configuration
})

export const prepareData = state => ({
  tagCategories: serializeTags(state?.categories)
})

export const useConf = () =>
  useQuery(gql`
    query {
      configuration {
        id
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
  `)

export const useUpdateConf = () =>
  useMutation(gql`
    mutation($tagCategories: String!) {
      updateConfiguration(tagCategories: $tagCategories) {
        id
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
  `)

export const canSubmit = (state, loading) =>
  !loading &&
  state &&
  JSON.stringify(state.categories) !== JSON.stringify(state.initial.tagCategories)

export const serializeTags = categories =>
  JSON.stringify(
    categories.map(({ id, name, order, labels }) => {
      const serializedLabels = labels.map(({ id, name, order }) => {
        if (isUuidV4(id)) {
          return { name, order }
        } else {
          return { id, name, order }
        }
      })

      if (isUuidV4(id)) {
        return { name, order, labels: serializedLabels }
      } else {
        return { id, name, order, labels: serializedLabels }
      }
    })
  )
