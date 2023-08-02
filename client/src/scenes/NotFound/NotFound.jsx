import Button from 'components/Button'
import { useNavigate } from 'react-router'
import { getIntl } from 'services'

const NotFound = () => {
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

NotFound.translations = {
  en: { title: 'Ooops! 404', subtitle: "Looks like we couldn't find what you were looking for..." },
  fr: {
    title: 'Ouups ! 404',
    subtitle: "Il semblerait que nous n'ayons pas trouvé ce que vous cherchiez...",
  },
}

export default NotFound
