import cn from 'classnames'
import { Button } from 'components'
import { useClickOutside } from 'helpers'
import { useState } from 'react'

const SpecialtiesList = ({ user, services }) => {
  const [opened, setOpened] = useState(false)
  const ref = useClickOutside(() => setOpened(false))

  return (
    <>
      <Button icon={'add'} link style={{ padding: 0 }} onClick={() => setOpened(op => !op)} />
      <ul ref={ref} className="specialtiesList" style={{ display: opened ? 'flex' : 'none' }}>
        {services.map(service => {
          const isSelected = !!user.specialties.filter(spe => spe.id === service.id).length
          return (
            <li
              className={cn('specialtyEl', {
                selected: isSelected
              })}
            >
              <button className="specialtyButton">{service.name}</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default SpecialtiesList
