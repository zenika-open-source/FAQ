import React, { useState } from 'react'
import ReactMde, { commands } from 'react-mde'

import { markdown, useIntl } from 'services'

import { emojiPickerCommand } from './EmojiPicker'

import 'react-mde/lib/styles/css/react-mde-all.css'

const listCommands = [
  ...commands.getDefaultCommands(),
  {
    commands: [emojiPickerCommand]
  }
]

const MarkdownEditor = ({ content, onChange, ...rest }) => {
  const intl = useIntl(MarkdownEditor)
  const [selectedTab, setSelectedTab] = useState('write')

  return (
    <ReactMde
      className="markdown-editor"
      value={content}
      onChange={onChange}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={md => Promise.resolve(markdown.text(md || ''))}
      commands={listCommands}
      l18n={intl('l18n')}
      {...rest}
    />
  )
}

MarkdownEditor.translations = {
  en: {
    l18n: {
      write: 'Write',
      preview: 'Preview'
    }
  },
  fr: {
    l18n: {
      write: 'Ecrire',
      preview: 'Prévisualiser'
    }
  }
}

export default MarkdownEditor
