import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'

import { useIntl } from 'services'

const Random = ({ randomNode }) => {
  const intl = useIntl(Random)

  if (randomNode.id) {
    return <Redirect to={`/q/${randomNode.question.slug}-${randomNode.id}`} />
  }

  return <div style={{ textAlign: 'center', marginTop: '3rem' }}>{intl('error')}</div>
}

Random.propTypes = {
  randomNode: PropTypes.object.isRequired
}

Random.translations = {
  en: {
    loading: 'Unleashing the randomizator...',
    error: 'There is no questions corresponding to your search. Try again later!'
  },
  fr: {
    loading: 'Déverrouillage du randomizateur...',
    error: "Il n'y a pas de question correspondant à votre recherche. Essayez plus tard!"
  }
}

export default Random
