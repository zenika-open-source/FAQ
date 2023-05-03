import Card, { CardText } from 'components/Card'
import PropTypes from 'prop-types'
import { getIntl } from 'services'

import './Specialties.css'

const Specialties = ({ spe }) => {
  const intl = getIntl(Specialties)

  return (
    <Card>
      <CardText className="specialties">
        <h2 style={{ marginBottom: '1rem' }}>{intl('title')}</h2>
        <hr />
        {spe ? (
          spe.map(s => (
            <p key={s.name} className="speciality">
              <i className="material-icons">verified</i>
              {s.name}
            </p>
          ))
        ) : (
          <p>{intl('empty')}</p>
        )}
      </CardText>
    </Card>
  )
}

Specialties.propTypes = {
  spe: PropTypes.array
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
