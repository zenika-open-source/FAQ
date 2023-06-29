export const handleTranslation = (targetLanguage, node) => {
  let content = { question: '', answer: '', isTranslation: false, language: targetLanguage }
  if (node.question.translation?.language === targetLanguage && node.question.translation?.text) {
    content = { ...content, question: node.question.translation.text, isTranslation: true }
  } else {
    content = { ...content, question: node.question.title }
  }
  if (node.answer) {
    if (node.answer.translation?.language === targetLanguage && node.answer.translation?.text) {
      content = { ...content, answer: node.answer.translation.text, isTranslated: true }
    } else {
      content = { ...content, answer: node.answer.content }
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
