import React from 'react'
import { useIntl } from 'services'
import { useQuery, gql } from '@apollo/client'

import { Loading } from 'components'

import { nodeFragment } from '../../queries'
import { Redirect } from 'react-router'

const Random = () => {
  const intl = useIntl(Random)

  const { loading, data } = useQuery(
    gql`
    query {
      randomQuestion {
        ${nodeFragment}
      }
    }
  `,
    {
      fetchPolicy: 'network-only'
    }
  )
  const node = data?.randomQuestion

  if (loading) return <Loading text={intl('loading')} />

  if (node) {
    return <Redirect to={`/q/${node.question.slug}-${node.id}`} />
  }

  return <div style={{ textAlign: 'center', marginTop: '3rem' }}>{intl('error')}</div>
}

Random.translations = {
  en: {
    loading: 'Unleashing the randomizator...',
    error: 'There is no questions corresponding to your search. Try again later!'
  },
  fr: {
    loading: 'Déchaîner du randomizateur...',
    error: "Il n'y a pas de question correspondant à votre recherche. Essayez plus tard!"
  }
}

export default Random
