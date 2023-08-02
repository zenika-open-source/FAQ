import { useQuery } from '@apollo/client'
import { Loading } from 'components'
import { Navigate, Route, Routes, useParams } from 'react-router'

import { GET_NODE } from './queries'
import Answer from './scenes/Answer/Answer'
import Edit from './scenes/Edit/Edit'
import Read from './scenes/Read/Read'

const Question = () => {
  const params = useParams()
  const { data, loading } = useQuery(GET_NODE, {
    variables: { id: params.slug?.split('-').at(-1) },
    skip: !params.slug,
  })

  if (loading) return <Loading />

  return (
    <Routes>
      <Route path="/" element={<Read zNode={data.zNode} loading={loading} />} />
      <Route path="/edit" element={<Edit zNode={data.zNode} loading={loading} />} />
      <Route path="/answer" element={<Answer zNode={data.zNode} loading={loading} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default Question
