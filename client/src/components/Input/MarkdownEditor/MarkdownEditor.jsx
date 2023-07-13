import PropTypes from 'prop-types'

import MDEditor from '@uiw/react-md-editor'
import '../Input.css'

const MarkdownEditor = ({ content, onChange }) => {
  return (
    <div data-color-mode="light">
      <MDEditor className="markdown-editor" value={content} onChange={onChange} />
    </div>
  )
}

MarkdownEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func
}

export default MarkdownEditor
