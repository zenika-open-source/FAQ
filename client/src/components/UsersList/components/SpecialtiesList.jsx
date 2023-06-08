import cn from 'classnames'
import { Button } from 'components'
import { useClickOutside } from 'helpers'
import { useState } from 'react'

const SpecialtiesList = ({ specialties, services, onChange }) => {
  const [opened, setOpened] = useState(false)
  const ref = useClickOutside(() => setOpened(false))

  return (
    <>
      <Button
        icon={'add'}
        link
        style={{ padding: 0 }}
        onClick={() => setOpened(opened => !opened)}
      />
      <ul ref={ref} className="specialtiesList" style={{ display: opened ? 'flex' : 'none' }}>
        {services.map(service => {
          const isSelected = specialties?.filter(({ id }) => id === service.id).length > 0
          return (
            <li
              key={service.id}
              className={cn('specialtyEl', {
                selected: isSelected
              })}
              onClick={() =>
                onChange(
                  isSelected
                    ? {
                        data: specialties.filter(specialty => specialty.id !== service.id),
                        action: 'delete'
                      }
                    : { data: [...specialties, service], action: 'add' }
                )
              }
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
