import Card, { CardText } from '@components/Card'
import PropTypes from 'prop-types'
import { getIntl } from '@services'
import { Loading } from '@components'

import './Specialties.css'

const Specialties = ({ specialties }) => {
  const intl = getIntl(Specialties)

  if (specialties === undefined) return <Loading />

  return (
    <Card>
      <CardText className="specialties">
        <h2 style={{ marginBottom: '1rem' }}>{intl('title')}</h2>
        <hr />
        {specialties.length > 0 ? (
          <ul className="specialtiesList">
            {specialties.map(specialty => (
              <li key={specialty.name} className="specialty">
                <i className="material-icons">verified</i>
                {specialty.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>{intl('empty')}</p>
        )}
      </CardText>
    </Card>
  )
}

Specialties.propTypes = {
  specialties: PropTypes.array
}

Specialties.translations = {
  en: {
    title: 'Specialties',
    empty: 'No specialties yet'
  },
  fr: {
    title: 'Spécialitées',
    empty: 'Pas encore de spécialitées'
  }
}

export default Specialties
