export const detectLanguage = async text => {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2/detect?key=${
      import.meta.env.VITE_CLOUD_TRANSLATION_API_KEY
    }`,
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
