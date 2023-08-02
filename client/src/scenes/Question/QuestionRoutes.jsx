import { Navigate, Route, Routes } from 'react-router-dom'

import Question from './Question'

import Edit from './scenes/Edit'
import Random from './scenes/Random'

const QuestionRoutes = () => {
  return (
    <Routes>
      <Route path="new" element={<Edit />} />
      <Route path="random/:tag?" element={<Random />} />
      <Route path=":slug/*" element={<Question />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default QuestionRoutes
