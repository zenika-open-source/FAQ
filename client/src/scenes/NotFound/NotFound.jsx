import PropTypes from 'prop-types'

import Button from 'components/Button'
import { getIntl } from 'services'
import { useNavigate } from 'react-router'

const NotFound = ({ history }) => {
  const navigate = useNavigate()
  const intl = getIntl(NotFound)

  return (
    <div>
      <Button icon="chevron_left" label="Home" link onClick={() => navigate('/')} />
      <div style={{ textAlign: 'center' }}>
        <h1>{intl('title')}</h1>
        <br />
        <br />
        <img src="/img/favicon/favicon-64.png" alt="emoji" />
        <br />
        <br />
        <h3>{intl('subtitle')}</h3>
      </div>
    </div>
  )
}

NotFound.propTypes = {
  history: PropTypes.object.isRequired
}

NotFound.translations = {
  en: { title: 'Ooops! 404', subtitle: "Looks like we couldn't find what you were looking for..." },
  fr: {
    title: 'Ouups ! 404',
    subtitle: "Il semblerait que nous n'ayons pas trouvé ce que vous cherchiez..."
  }
}

export default NotFound
