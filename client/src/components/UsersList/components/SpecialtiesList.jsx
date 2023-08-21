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
      <Button icon={'add'} intent="link" onClick={() => setOpened((opened) => !opened)} />
      <ul
        ref={ref}
        className={`min-w-[100px] absolute -top-[10px] -right-[110px] flex-col border border-secondary-dark bg-secondary-light rounded-sm p-1 list-none z-10 ${
          opened ? 'flex' : 'hidden'
        } before:content-[''] before:block before:absolute before:w-0 before:h-0 before:border-solid before:top-[10.75px] before:border-transparent before:border-r-secondary-dark before:border-[10.25px] before:-left-[20px] after:content-[''] after:block after:absolute after:w-0 after:h-0 after:border-solid after:top-[11px] after:border-transparent after:border-r-secondary-light after:border-[10px] after:-left-[19px]`}
      >
        {userSpecialties.map((specialty) => {
          const isSelected = specialties?.filter(({ id }) => id === specialty.id).length > 0
          return (
            <li
              key={specialty.id}
              className={cn(
                'w-full flex items-center justify-center p-[0.3rem] pt-[0.1rem] cursor-pointer hover:bg-secondary hover:text-secondary-font-dark',
                {
                  'before:content-["✓"] before:mr-1 before:text-primary hover:before:content-["✕"]':
                    isSelected,
                },
              )}
              onClick={() =>
                onChange(
                  isSelected
                    ? {
                        data: specialties.filter((specialty) => specialty.id !== specialty.id),
                        action: 'delete',
                      }
                    : { data: [...specialties, specialty], action: 'add' },
                )
              }
            >
              <button
                className="p-0 w-full h-full bg-none border-none cursor-pointer"
                style={{ fontVariant: 'small-caps' }}
              >
                {specialty.name}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default SpecialtiesList
