const fs = require('fs')

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
    console.error(
      "L'appel à Google Cloud Translation API a échoué. Vérifiez les limites d'appels fixées pour ce projet.",
      error
    )
    return ''
  }
}

const getTranslatedText = async (text, originalLanguage) => {
  try {
    const language = originalLanguage === 'fr' ? 'en' : 'fr'
    const response = await fetch(translationApiUrl, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        target: language
      })
    })
    const res = await response.json()
    const data = res.data
    return { language, text: data.translations[0].translatedText }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "L'appel à Google Cloud Translation API a échoué. Vérifiez les limites d'appels fixées pour ce projet.",
      error
    )
  }
}

const readTranslationMockFile = async file => {
  try {
    const rawData = fs.readFileSync(file)
    const data = JSON.parse(rawData)
    return data
  } catch (error) {
    console.error(error)
  }
}

const findData = (data, text) => {
  const keys = Object.keys(data)
  for (const key of keys) {
    const item = data[key]
    if (item.title === text || item.content === text) {
      return item
    }
  }

  return null
}

const storeTranslation = async text => {
  let language = ''
  let translation = { language: language, text: '' }
  if (process.env.CLOUD_TRANSLATION_API_KEY) {
    language = await detectLanguage(text)
    translation = await getTranslatedText(text, language)
  } else if (process.env.TRANSLATION_MOCK_FILE) {
    const translationMocks = await readTranslationMockFile(process.env.TRANSLATION_MOCK_FILE)
    const data = findData(translationMocks, text)
    language = data.language
    translation = data.translation
  }
  return { language, translation }
}

const translateContentAndSave = async (zNode, ctx, info) => {
  const title = zNode.question.title
  const content = zNode.answer?.content ?? ''
  const { language: questionLanguage, translation: questionTranslation } = await storeTranslation(
    title
  )
  const { language: answerLanguage, translation: answerTranslation } = await storeTranslation(
    content
  )
  const node = await ctx.prisma.mutation.updateZNode(
    {
      where: { id: zNode.id },
      data: {
        question: {
          update: {
            language: questionLanguage,
            translation: {
              create: {
                language: questionTranslation.language,
                text: questionTranslation.text
              }
            }
          }
        },
        ...(zNode.answer
          ? {
              answer: {
                update: {
                  language: answerLanguage,
                  translation: {
                    create: {
                      language: answerTranslation.language,
                      text: answerTranslation.text
                    }
                  }
                }
              }
            }
          : {})
      }
    },
    info
  )
  return node
}

module.exports = {
  detectLanguage,
  getTranslatedText,
  storeTranslation,
  translateContentAndSave
}
