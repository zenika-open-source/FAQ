const key = process.env.CLOUD_TRANSLATION_API_KEY || ''

const detectLanguage = async text => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${key}`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: text
        })
      }
    )
    const res = await response.json()
    const data = await res.data
    return data.detections[0][0].language
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

const getTranslatedText = async (text, language) => {
  try {
    const targetLanguage = language === 'fr' ? 'en' : 'fr'
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          target: targetLanguage
        })
      }
    )
    const res = await response.json()
    const data = await res.data
    return { targetLanguage, translatedText: data.translations[0].translatedText }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

const translationToKeyValuePairs = (language, text) => {
  return {
    key: language,
    value: text
  }
}

const keyValuePairsToTranslations = translation => {
  const { key, value } = translation
  return {
    language: key,
    text: value
  }
}

module.exports = {
  detectLanguage,
  getTranslatedText,
  translationToKeyValuePairs,
  keyValuePairsToTranslations
}
