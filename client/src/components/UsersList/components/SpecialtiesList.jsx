/* eslint no-self-compare: 0 */

import cn from 'classnames'
import { Button } from 'components'
import { useClickOutside } from 'helpers'
import { useState } from 'react'

const SpecialtiesList = ({ specialties, userSpecialties, onChange }) => {
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
        {userSpecialties.map(specialty => {
          const isSelected = specialties?.filter(({ id }) => id === specialty.id).length > 0
          return (
            <li
              key={specialty.id}
              className={cn('specialtyEl', {
                selected: isSelected
              })}
              onClick={() =>
                onChange(
                  isSelected
                    ? {
                        data: specialties.filter(specialty => specialty.id !== specialty.id),
                        action: 'delete'
                      }
                    : { data: [...specialties, specialty], action: 'add' }
                )
              }
            >
              <button className="specialtyButton">{specialty.name}</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default SpecialtiesList
