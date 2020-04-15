import { useQuery, gql, useMutation } from '@apollo/client'

export const initState = configuration => ({
  synonyms: synonymsToList(configuration?.algoliaSynonyms),
  initial: configuration
})

export const prepareData = state => ({
  synonyms: JSON.stringify(listToSynonyms(state?.synonyms))
})

export const useConf = () =>
  useQuery(gql`
    query {
      configuration {
        id
        algoliaSynonyms {
          objectID
          type
          synonyms
        }
      }
    }
  `)

export const useUpdateConf = () =>
  useMutation(gql`
    mutation($synonyms: String!) {
      updateConfiguration(algoliaSynonyms: $synonyms) {
        id
        algoliaSynonyms {
          objectID
          type
          synonyms
        }
      }
    }
  `)

export const canSubmit = (state, loading) =>
  !loading &&
  state &&
  JSON.stringify(listToSynonyms(state.synonyms)) !==
    JSON.stringify(listToSynonyms(synonymsToList(state.initial.algoliaSynonyms)))

export const synonymsToList = synonyms =>
  (synonyms || []).map(({ objectID, synonyms }, id) => ({
    id,
    key: objectID,
    value: synonyms.join(', ')
  }))

export const listToSynonyms = list =>
  list
    .filter(item => item.key && item.value)
    .map(item => ({
      objectID: item.key,
      type: 'synonym',
      synonyms: item.value.split(',').map(x => x.trim())
    }))
