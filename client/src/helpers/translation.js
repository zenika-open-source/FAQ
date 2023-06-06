export const handleTranslation = (
  originalLanguage,
  targetLanguage,
  node,
  setQuestion,
  setAnswer
) => {
  if (originalLanguage === targetLanguage) {
    setQuestion(node.question.title)
    {
      node.answer && setAnswer(node.answer.content)
    }
  } else {
    setQuestion(node.question.translation.text)
    {
      node.answer && setAnswer(node.answer.translation.text)
    }
  }
}
