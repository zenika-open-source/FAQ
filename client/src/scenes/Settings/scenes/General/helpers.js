import { useQuery, gql, useMutation } from '@apollo/client'

export const initState = configuration => ({
  title: configuration?.title,
  authorizedDomains: configuration?.authorizedDomains?.join(', '),
  initial: configuration
})

export const prepareData = state => ({
  title: state?.title,
  authorizedDomains: state?.authorizedDomains
    ?.split(',')
    .map(x => x.trim())
    .filter(x => x)
})

export const useConf = () =>
  useQuery(gql`
    query {
      configuration {
        id
        title
        authorizedDomains
      }
    }
  `)

export const useUpdateConf = () =>
  useMutation(gql`
    mutation($title: String!, $authorizedDomains: [String!]!) {
      updateConfiguration(title: $title, authorizedDomains: $authorizedDomains) {
        id
        title
        authorizedDomains
      }
    }
  `)

export const canSubmit = (state, loading) =>
  !loading &&
  state &&
  (state.title !== state.initial.title ||
    state.authorizedDomains !== state.initial.authorizedDomains.join(', '))
