import PropTypes from 'prop-types'
import { Navigate, Route, Routes } from 'react-router-dom'

import { withNode } from './Question.container'

import Answer from './scenes/Answer'
import Edit from './scenes/Edit'
import Random from './scenes/Random'
import Read from './scenes/Read'

const withNodeRead = withNode(Read)
const withNodeEdit = withNode(Edit)
const withNodeAnswer = withNode(Answer)

const Question = () => {
  const { pathname } = useMatch('/q')

  return (
    <Routes>
      <Route path={`${pathname}/new`} element={<Edit />} />
      <Route path={`${pathname}/random/:tag?`} element={<Random />} />
      <Route path={`${pathname}/:slug`} element={withNodeRead} />
      <Route path={`${pathname}/:slug/edit`} element={withNodeEdit} />
      <Route path={`${pathname}/:slug/answer`} element={withNodeAnswer} />
      <Route render={() => <Navigate to="/" />} />
    </Routes>
  )
}

// Question.propTypes = {
//   match: PropTypes.object.isRequired
// }

export default Question
