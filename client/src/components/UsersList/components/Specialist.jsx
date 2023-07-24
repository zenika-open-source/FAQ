import { useMutation } from '@apollo/client'
import { alert, getIntl } from 'services'
import { UPDATE_SPECIALTIES } from '../queries'
import SpecialtiesList from './SpecialtiesList'
import { useAuth, useUser } from 'contexts'

const Specialist = ({ specialist, services, onUpdateSpecialty }) => {
  const intl = getIntl(Specialist)

  const specialties = specialist.specialties
  const user = useUser()
  const { isAdmin } = useAuth()

  const onSpecialtyChange = (params) => {
    const { action, data } = params
    editSpecialties(data, action)
  }

  const [mutateFunction] = useMutation(UPDATE_SPECIALTIES)
  const editSpecialties = async (specialties, action) => {
    try {
      const { id } = specialist
      const variables = {
        id,
        specialties: specialties.map(({ __typename, name, ...rest }) => rest),
      }
      await mutateFunction({ variables })
      await onUpdateSpecialty()
      alert.pushSuccess(intl(`alert.${action}_success`))
    } catch (error) {
      alert.pushDefaultError(error)
    }
  }

  return (
    <li className="userElement">
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
            specialties.map((specialty) => (
              <div key={specialty.id} className="userSpecialty">
                <span>{specialty.name}</span>
                <i
                  className="material-icons"
                  onClick={() =>
                    onSpecialtyChange({
                      data: specialties.filter(({ id }) => id !== specialty.id),
                      action: 'delete',
                    })
                  }
                >
                  close
                </i>
              </div>
            ))}
        </div>
        {services && (
          <SpecialtiesList
            specialties={specialties}
            userSpecialties={isAdmin ? services : user.specialties}
            onChange={onSpecialtyChange}
          />
        )}
      </div>
    </li>
  )
}

Specialist.translations = {
  en: {
    alert: {
      add_success: 'The specialty has been added',
      delete_success: 'The specialty has been removed',
    },
  },
  fr: {
    alert: {
      add_success: 'La spécialité a été ajoutée',
      delete_success: 'La spécialité a été supprimée',
    },
  },
}

export default Specialist
