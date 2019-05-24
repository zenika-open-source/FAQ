import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactMde, { commands } from 'react-mde'

import { markdown } from 'services'

import { emojiPickerCommand } from './EmojiPicker'

import 'react-mde/lib/styles/css/react-mde-all.css'
import '../Input.css'

const listCommands = [
  ...commands.getDefaultCommands(),
  {
    commands: [emojiPickerCommand]
  }
]

const MarkdownEditor = ({ content, onChange }) => {
  const [tab, setTab] = useState('write')
  return (
    <ReactMde
      className="markdown-editor"
      value={content}
      onTabChange={setTab}
      selectedTab={tab}
      generateMarkdownPreview={md => Promise.resolve(markdown.showdown.makeHtml(md))}
      onChange={onChange}
      commands={listCommands}
    />
  )
}

MarkdownEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func
}

export default MarkdownEditor
