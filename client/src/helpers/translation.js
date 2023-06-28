export const handleTranslation = (
  originalQuestionLanguage,
  originalAnswerLanguage,
  targetLanguage,
  node
) => {
  let content = { question: '', answer: '', isTranslation: false, language: targetLanguage }
  if (originalQuestionLanguage === targetLanguage) {
    content = { ...content, question: node.question.title }
  } else {
    content = { ...content, question: node.question.translation?.text, isTranslation: true }
  }
  if (node.answer) {
    if (originalAnswerLanguage === targetLanguage) {
      content = { ...content, answer: node.answer.content }
    } else {
      content = { ...content, answer: node.answer.translation?.text, isTranslated: true }
    }
  }
  return content
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
