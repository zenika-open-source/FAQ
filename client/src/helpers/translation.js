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

export const getNavigatorLanguage = () => {
  const language = navigator?.language ?? 'en'
  const [formattedLanguage] = language.split('-')
  if (formattedLanguage !== 'fr' && formattedLanguage !== 'en') {
    return formattedLanguage === 'en'
  }
  return formattedLanguage
}

export const shouldAutoTranslate = (navigatorLanguage, questionLanguage) => {
  return navigatorLanguage !== questionLanguage
}
