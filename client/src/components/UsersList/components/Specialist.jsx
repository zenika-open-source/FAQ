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
    <li className="px-4 py-2 flex items-center justify-between gap-4 border border-secondary rounded-sm">
      <div className="flex items-center gap-4">
        <div>
          <i className="material-icons text-[2rem]">
            {specialist.admin ? 'admin_panel_settings' : 'person'}
          </i>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">{specialist.name}</span>
          <span className="text-sm">{specialist.email}</span>
        </div>
      </div>
      <div className="relative flex items-center gap-1">
        <div className="flex items-center flex-wrap gap-2">
          {specialties &&
            specialties.map((specialty) => (
              <div
                role="generic"
                key={specialty.id}
                className="bg-primary-light text-primary-font leading-3 px-2 py-1 rounded-sm text-base flex items-end my-[0.1rem] mr-[0.4rem]"
              >
                <span style={{ fontVariant: 'small-caps' }}>{specialty.name}</span>
                <i
                  className="material-icons text-sm ml-1 cursor-pointer flex items-end hover:font-bold"
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
