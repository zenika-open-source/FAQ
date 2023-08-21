import { Tab, UsersList } from 'components'

import { getIntl } from 'services'

const Specialists = () => {
  const intl = getIntl(Specialists)

  return (
    <Tab label={intl('tab')}>
      <h2 className="mb-2">{intl('title')}</h2>
      <UsersList />
    </Tab>
  )
}

Specialists.translations = {
  en: {
    tab: 'Specialists',
    title: 'Users',
  },
  fr: {
    tab: 'Spécialistes',
    title: 'Utilisateurs',
  },
}

export default Specialists
