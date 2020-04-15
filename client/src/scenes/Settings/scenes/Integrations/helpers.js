import { useQuery, gql, useMutation } from '@apollo/client'

export const initState = configuration => ({
  workplaceSharing: configuration?.workplaceSharing,
  slackChannelHook: configuration?.slackChannelHook,
  slackCommandKey: configuration?.slackCommandKey,
  initial: configuration
})

export const prepareData = state => ({
  workplaceSharing: state?.workplaceSharing,
  slackChannelHook: state?.slackChannelHook
})

export const useConf = () =>
  useQuery(gql`
    query {
      configuration {
        id
        workplaceSharing
        slackChannelHook
        slackCommandKey
      }
    }
  `)

export const useUpdateConf = () =>
  useMutation(gql`
    mutation($workplaceSharing: Boolean!, $slackChannelHook: String) {
      updateConfiguration(
        workplaceSharing: $workplaceSharing
        slackChannelHook: $slackChannelHook
      ) {
        id
        workplaceSharing
        slackChannelHook
        slackCommandKey
      }
    }
  `)

export const canSubmit = (state, loading) =>
  !loading &&
  state &&
  (state.workplaceSharing !== state.initial.workplaceSharing ||
    state.slackChannelHook !== state.initial.slackChannelHook)

export const useRegenerateSlackCommandKey = () =>
  useMutation(gql`
    mutation regenerateSlackCommandKey {
      regenerateSlackCommandKey {
        id
        workplaceSharing
        slackChannelHook
        slackCommandKey
      }
    }
  `)
