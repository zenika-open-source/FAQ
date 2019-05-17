import { useEffect, useRef } from 'react'

const useClickOutside = onClickOutside => {
  const ref = useRef(null)

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClickOutside(event)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return ref
}

export default useClickOutside
