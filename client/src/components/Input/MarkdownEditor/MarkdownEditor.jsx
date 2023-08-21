import PropTypes from 'prop-types'

import MDEditor from '@uiw/react-md-editor'

const MarkdownEditor = ({ content, onChange }) => {
  return (
    <div data-color-mode="light">
      <MDEditor className="w-full" value={content} onChange={onChange} />
    </div>
  )
}

MarkdownEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
}

export default MarkdownEditor
