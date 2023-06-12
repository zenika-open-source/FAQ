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
  let language = navigator.language
  if (language !== 'fr' || language !== 'en') {
    language === 'en'
  }
  const [formattedLanguage] = language.split('-')
  return formattedLanguage
}

export const handleAutoTranslation = (navigatortLanguage, questionLanguage) => {
  let isAutoTranslated = false
  if (navigatortLanguage !== questionLanguage) {
    isAutoTranslated = true
  }
  return isAutoTranslated
}
