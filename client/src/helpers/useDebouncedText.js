import { useMemo, useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

const useDebouncedText = (initialState, debounceTime = 200) => {
  const [text, setText] = useState(initialState)
  const [debouncedText, setDebouncedText] = useState(initialState)

  const debouncedSetDebouncedText = useMemo(() => debounce(setDebouncedText, debounceTime), [
    debounceTime
  ])

  useEffect(() => {
    debouncedSetDebouncedText(text)
  }, [text, debouncedSetDebouncedText])

  return [text, debouncedText, setText, setDebouncedText]
}

export default useDebouncedText
