import { useBeforeUnload, unstable_useBlocker as useBlocker } from 'react-router-dom'

const usePrompt = (message, { beforeUnload } = {}) => {
  let blocker = useBlocker(
    React.useCallback(() => (typeof message === 'string' ? !window.confirm(message) : false), [
      message
    ])
  )
  let prevState = React.useRef(blocker.state)
  React.useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset()
    }
    prevState.current = blocker.state
  }, [blocker])

  useBeforeUnload(
    React.useCallback(
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
