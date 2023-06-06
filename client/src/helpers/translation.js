export const handleTranslation = (
  originalLanguage,
  targetLanguage,
  node,
  setQuestion,
  setAnswer
) => {
  if (originalLanguage === targetLanguage) {
    setQuestion(node.question.title)
    setAnswer(node.answer.content)
  } else {
    setQuestion(node.question.translation.text)
    setAnswer(node.answer.translation.text)
  }
}
