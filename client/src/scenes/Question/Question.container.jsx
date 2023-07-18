import { useQuery } from '@apollo/client'
import { Error, Loading } from 'components'
import { useState } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router'

import { GET_NODE } from './queries'
import Answer from './scenes/Answer/Answer'
import Edit from './scenes/Edit/Edit'
import Read from './scenes/Read/Read'

const QuestionContainer = () => {
  const params = useParams()
  const [zNode, setZNode] = useState(null)
  const { loading, error } = useQuery(GET_NODE, {
    variables: { id: params.slug.split('-').pop() },
    skip: !params.slug,
    onCompleted(data) {
      setZNode(data.zNode)
    }
  })

  if (loading) return <Loading />

  if (error) return <Error />

  return (
    <Routes>
      <Route path="/" element={<Read zNode={zNode} loading={loading} />} />
      <Route path="/edit" element={<Edit zNode={zNode} loading={loading} />} />
      <Route path="/answer" element={<Answer zNode={zNode} loading={loading} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default QuestionContainer
