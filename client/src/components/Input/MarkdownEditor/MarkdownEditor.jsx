import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactMde, { commands } from 'react-mde'

import { markdown, getIntl } from '@services'

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
  const intl = getIntl(MarkdownEditor)
  const [tab, setTab] = useState('write')
  return (
    <ReactMde
      className="markdown-editor"
      value={content}
      onTabChange={setTab}
      selectedTab={tab}
      generateMarkdownPreview={md => Promise.resolve(markdown.text(md))}
      onChange={onChange}
      commands={listCommands}
      l18n={intl('l18n')}
    />
  )
}

MarkdownEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func
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
