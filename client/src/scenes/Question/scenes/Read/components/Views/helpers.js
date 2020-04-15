export const isSessionSeen = nodeId => {
  const views = JSON.parse(sessionStorage.getItem('question-views') || '[]')

  return views.includes(nodeId)
}

export const setSessionSeen = nodeId => {
  const views = JSON.parse(sessionStorage.getItem('question-views') || '[]')

  sessionStorage.setItem('question-views', JSON.stringify([...views, nodeId]))
}
