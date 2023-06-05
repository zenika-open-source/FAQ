const detectLanguage = async text => {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.CLOUD_TRANSLATION_API_KEY}`,
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
}

const getTranslatedText = async (text, language) => {
  const targetLanguage = language === 'fr' ? 'en' : 'fr'
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env.CLOUD_TRANSLATION_API_KEY}`,
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
