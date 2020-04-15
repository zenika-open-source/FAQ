import React from 'react'
import { useHistory } from 'react-router-dom'

import { useIntl } from 'services'
import { Button } from 'components'

const NotFound = () => {
  const intl = useIntl(NotFound)
  const history = useHistory()

  return (
    <div>
      <Button icon="chevron_left" label="Home" link onClick={() => history.push('/')} />
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

NotFound.translations = {
  en: { title: 'Ooops! 404', subtitle: "Looks like we couldn't find what you were looking for..." },
  fr: {
    title: 'Ouups ! 404',
    subtitle: "Il semblerait que nous n'ayons pas trouvé ce que vous cherchiez..."
  }
}

export default NotFound
