const key = process.env.CLOUD_TRANSLATION_API_KEY || ''
const detectApiUrl = new URL('https://translation.googleapis.com/language/translate/v2/detect')
detectApiUrl.searchParams.append('key', key)
const translationApiUrl = new URL('https://translation.googleapis.com/language/translate/v2')
translationApiUrl.searchParams.append('key', key)

const detectLanguage = async text => {
  try {
    const response = await fetch(detectApiUrl, {
      method: 'POST',
      body: JSON.stringify({
        q: text
      })
    })
    const res = await response.json()
    const data = res.data
    return data.detections[0][0].language
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return ''
  }
}

const getTranslatedText = async (text, language) => {
  try {
    const targetLanguage = language === 'fr' ? 'en' : 'fr'
    const response = await fetch(translationApiUrl, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        target: targetLanguage
      })
    })
    const res = await response.json()
    const data = res.data
    return { language, text: data.translations[0].translatedText }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

const storeTranslation = async text => {
  let language = ''
  let translation = { language: language, text: '' }
  if (process.env.CLOUD_TRANSLATION_API_KEY) {
    language = await detectLanguage(text)
    translation = await getTranslatedText(text, language)
  }
  return { language, translation }
}

module.exports = {
  detectLanguage,
  getTranslatedText,
  storeTranslation
}
