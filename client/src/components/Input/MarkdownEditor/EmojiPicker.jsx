import React, { useState, useRef } from 'react'
import { Picker } from 'emoji-mart'

import { useClickOutside } from '@helpers'

import 'emoji-mart/css/emoji-mart.css'
import './EmojiPicker.scss'

const EmojiPicker = () => {
  const [opened, setOpened] = useState(false)
  const buttonRef = useRef(null)

  const pickerRef = useClickOutside(evt => {
    if (buttonRef.current && !buttonRef.current.contains(evt.target)) {
      setOpened(false)
    }
  })

  return (
    <div className="emoji-picker-wrapper">
      <span
        ref={buttonRef}
        onClick={() => setOpened(op => !op)}
        aria-label="Insert an emoji"
        role="img"
      >
        😀
      </span>
      {opened && (
        <div className="emoji-picker">
          <div ref={pickerRef}>
            <Picker
              native={true}
              title="Pick your emoji…"
              emoji="point_up"
              onSelect={selected => {
                setOpened(false)
                document.querySelector('textarea.mde-text').next_emoji = selected.native
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const emojiPickerCommand = {
  name: 'emoji',
  buttonComponentClass: 'div',
  icon: () => <EmojiPicker />,
  execute: (state0, api) => {
    if (api.textArea.next_emoji) {
      api.setSelectionRange({ start: state0.selection.end, end: state0.selection.end })
      api.replaceSelection(api.textArea.next_emoji)
      api.textArea.next_emoji = undefined
    }
  }
}

export default EmojiPicker
export { emojiPickerCommand }
