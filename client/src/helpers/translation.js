export const handleTranslation = (
  originalQuestionLanguage,
  originalAnswerLanguage,
  targetLanguage,
  node,
  setQuestion,
  setAnswer
) => {
  if (originalQuestionLanguage === targetLanguage) {
    setQuestion(node.question.title)
  } else {
    setQuestion(node.question.translation.text)
  }
  if (node.answer) {
    if (originalAnswerLanguage === targetLanguage) {
      setAnswer(node.answer.content)
    } else {
      setAnswer(node.answer.translation.text)
    }
  }
}
