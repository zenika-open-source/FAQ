import React from 'react'
import PropTypes from 'prop-types'
import Card, { CardText } from 'components/Card'
import { getIntl } from 'services'

const Specialities = () => {
  const intl = getIntl(Specialities)

  return (
    <Card>
      <CardText className="specialities">
        <h2 style={{ marginBottom: '1rem' }}>{intl('title')}</h2>
        <hr />
      </CardText>
    </Card>
  )
}

Specialities.propTypes = {
  logs: PropTypes.array,
  loading: PropTypes.bool,
  pagesCount: PropTypes.number,
  pageCurrent: PropTypes.number,
  onPageSelected: PropTypes.func,
  meta: PropTypes.object
}

Specialities.translations = {
  en: { title: 'Specialities' },
  fr: { title: 'Spécialitées' }
}

export default Specialities
