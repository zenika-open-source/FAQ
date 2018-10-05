import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import ReactMde, { ReactMdeCommands } from 'react-mde'

import 'react-mde/lib/styles/css/react-mde-all.css'

import './Input.css'

class MarkdownEditor extends PureComponent {
  render() {
    const { content, onChange } = this.props

    return (
      <ReactMde
        className="markdown-editor"
        value={content}
        showdownFlavor="github"
        onChange={onChange}
        commands={ReactMdeCommands.getDefaultCommands()}
      />
    )
  }
}

MarkdownEditor.propTypes = {
  content: PropTypes.object,
  onChange: PropTypes.func
}

export default MarkdownEditor
