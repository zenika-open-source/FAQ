import Card, { CardText } from 'components/Card'
import PropTypes from 'prop-types'
import { getIntl } from 'services'
import { Loading } from 'components'

const Specialties = ({ specialties }) => {
  const intl = getIntl(Specialties)

  if (specialties === undefined) return <Loading />

  return (
    <Card>
      <CardText>
        <h2 className="mb-4 font-bold">{intl('title')}</h2>
        <hr className="mb-2" />
        {specialties.length > 0 ? (
          <ul className="flex items-center justify-start flex-wrap gap-4">
            {specialties.map((specialty) => (
              <li
                key={specialty.name}
                className="flex items-center justify-center w-fit p-1 capitalize bg-primary-font text-primary bodrer border-primary rounded"
              >
                <i className="material-icons mr-2 text-base">verified</i>
                {specialty.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">{intl('empty')}</p>
        )}
      </CardText>
    </Card>
  )
}

Specialties.propTypes = {
  specialties: PropTypes.array,
}

Specialties.translations = {
  en: {
    title: 'Specialties',
    empty: 'No specialties yet',
  },
  fr: {
    title: 'Spécialités',
    empty: 'Pas encore de spécialités',
  },
}

export default Specialties
