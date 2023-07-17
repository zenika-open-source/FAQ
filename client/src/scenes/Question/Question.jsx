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
  return (
    <Routes>
      <Route path="/new" element={<Edit />} />
      <Route path="/random/:tag?" element={<Random />} />
      <Route path="/:slug" element={withNodeRead} />
      <Route path="/:slug/edit" element={withNodeEdit} />
      <Route path="/:slug/answer" element={withNodeAnswer} />
      <Route render={() => <Navigate to="/" />} />
    </Routes>
  )
}

export default Question
