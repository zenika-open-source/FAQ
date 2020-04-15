import React, { useEffect, useRef } from 'react'

const CtrlEnter = ({ children, onCtrlEnter, onlyEnter, ...rest }) => {
  const ref = useRef()

  useEffect(() => {
    const onKeyDown = e => {
      if (e.keyCode === 13 && (onlyEnter || e.ctrlKey)) {
        onCtrlEnter()
      }
    }

    if (ref.current) {
      const current = ref.current
      current.addEventListener('keydown', onKeyDown)
      return () => current.removeEventListener('keydown', onKeyDown)
    }
  }, [onCtrlEnter, onlyEnter])

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
}

export default CtrlEnter
