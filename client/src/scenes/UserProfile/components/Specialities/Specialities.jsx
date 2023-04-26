import Card, { CardText } from 'components/Card'
import PropTypes from 'prop-types'
import { getIntl } from 'services'
import { Loading } from 'components'

import './Specialities.css'

const Specialities = ({ spe }) => {
  const intl = getIntl(Specialities)

  if (spe === undefined) return <Loading />

  return (
    <Card>
      <CardText className="specialities">
        <h2 style={{ marginBottom: '1rem' }}>{intl('title')}</h2>
        <hr />
        {spe.length > 0 ? (
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

Specialities.propTypes = {
  spe: PropTypes.array
}

Specialities.translations = {
  en: {
    title: 'Specialities',
    empty: 'No specialities yet'
  },
  fr: {
    title: 'Spécialitées',
    empty: 'Pas encore de spécialitées'
  }
}

export default Specialities
