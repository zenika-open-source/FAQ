import PropTypes from 'prop-types'
import { Navigate } from 'react-router'

import { getIntl } from 'services'

const Random = ({ randomNode }) => {
  const intl = getIntl(Random)

  if (randomNode.id) {
    return <Navigate to={`/q/${randomNode.question.slug}-${randomNode.id}`} />
  }

  return <div className="text-center mt-12">{intl('error')}</div>
}

Random.propTypes = {
  randomNode: PropTypes.object.isRequired,
}

Random.translations = {
  en: {
    loading: 'Unleashing the randomizator...',
    error: 'There is no questions corresponding to your search. Try again later!',
  },
  fr: {
    loading: 'Déverrouillage du randomizateur...',
    error: "Il n'y a pas de question correspondant à votre recherche. Essayez plus tard!",
  },
}

export default Random
