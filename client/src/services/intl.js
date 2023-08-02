import get from 'lodash/get'

const getLanguage = () => {
  const raw = window.navigator.language
  if (raw.includes('-')) return raw.split('-')[0]
  return raw
}

export const getIntl = (component) => {
  let context = (component && component.translations) || {}
  const language = getLanguage()

  context = context[language] || context['en']

  return (path) => get(context, path)
}
