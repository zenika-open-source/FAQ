import { Button } from 'components'
import { useClickOutside } from 'helpers'
import { useState } from 'react'

const SpecialtiesList = ({ services }) => {
  const [opened, setOpened] = useState(false)
  const ref = useClickOutside(() => setOpened(false))

  return (
    <>
      <Button icon={'add'} link style={{ padding: 0 }} onClick={() => setOpened(op => !op)} />
      <ul ref={ref} className="specialtiesList" style={{ display: opened ? 'flex' : 'none' }}>
        {services.map(service => (
          <li className="specialtyEl">{service.name}</li>
        ))}
      </ul>
    </>
  )
}

export default SpecialtiesList
