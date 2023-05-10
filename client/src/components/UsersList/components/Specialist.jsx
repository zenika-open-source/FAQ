import { useApolloClient } from '@apollo/react-hooks'
import { useEffect, useState } from 'react'
import { alert, getIntl } from 'services'
import { UPDATE_SPECIALTIES } from '../queries'
import SpecialtiesList from './SpecialtiesList'

const Specialist = ({ specialist, services }) => {
  const intl = getIntl(Specialist)
  const apollo = useApolloClient()

  const [specialties, setSpecialties] = useState(specialist.specialties)

  const onSpecialtyChange = newSpecialties => {
    setSpecialties(newSpecialties)
    editSpecialties(newSpecialties)
  }

  const editSpecialties = specialties => {
    console.log(specialties)
    apollo
      .mutate({
        mutation: UPDATE_SPECIALTIES,
        variables: {
          id: specialist.id,
          specialties: specialties.map(({ __typename, ...rest }) => rest)
        }
      })
      .then(({ data }) => {
        console.log(data)
        alert.pushSuccess(intl('alert.edit_success'))
      })
      .catch(err => {
        alert.pushDefaultError(err)
      })
  }

  //   const removeSpecialty = async specialty => {
  //     try {
  //       setSpecialties(specialties.filter(spe => spe.id !== specialty.id))
  //       await updateSpecialties({
  //         variables: {
  //           id: specialist.id,
  //           specialties: specialties.map(({ __typename, ...rest }) => rest)
  //         }
  //       })
  //       alert.pushSuccess(intl('alert.delete_success'))
  //   } catch (err) {
  //     alert.pushDefaultError(err)
  //   }
  //   }

  useEffect(() => {
    if (specialist) {
      setSpecialties(specialist.specialties)
    }
  }, [specialist])

  return (
    <li key={specialist.id} className="userElement">
      <div className="userLeft">
        <div className="userIcon">
          <i className="material-icons">{specialist.admin ? 'admin_panel_settings' : 'person'}</i>
        </div>
        <div className="userInfo">
          <span className="userName">{specialist.name}</span>
          <span className="userEmail">{specialist.email}</span>
        </div>
      </div>
      <div className="userRight">
        <div className="userSpecialties">
          {specialties &&
            specialties.map(specialty => (
              <div key={specialty.id} className="userSpecialty">
                <span>{specialty.name}</span>
                <i
                  className="material-icons"
                  onClick={() =>
                    onSpecialtyChange(specialties.filter(spe => spe.id !== specialty.id))
                  }
                >
                  close
                </i>
              </div>
            ))}
        </div>
        <SpecialtiesList
          specialties={specialties}
          services={services}
          onChange={onSpecialtyChange}
        />
      </div>
    </li>
  )
}

Specialist.translations = {
  en: {
    alert: {
      add_success: 'The specialty has been added',
      delete_success: 'The specialty has been removed'
    }
  },
  fr: {
    alert: {
      add_success: 'La spécialitée a été ajoutée',
      delete_success: 'La spécialité a été supprimée'
    }
  }
}

export default Specialist
