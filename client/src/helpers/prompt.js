import { useCallback, useEffect, useRef } from 'react'
import { useBeforeUnload, unstable_useBlocker as useBlocker } from 'react-router-dom'

const usePrompt = (message, { beforeUnload } = {}) => {
  let blocker = useBlocker(
    useCallback(() => (typeof message === 'string' ? !window.confirm(message) : false), [message])
  )
  let prevState = useRef(blocker.state)
  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset()
    }
    prevState.current = blocker.state
  }, [blocker])

  useBeforeUnload(
    useCallback(
      event => {
        if (beforeUnload && typeof message === 'string') {
          event.preventDefault()
          event.returnValue = message
        }
      },
      [message, beforeUnload]
    ),
    { capture: true }
  )
}

export const Prompt = ({ when, message, ...props }) => {
  usePrompt(when ? message : false, props)
  return null
}
