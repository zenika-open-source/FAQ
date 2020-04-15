export const sourcesToKeyValuePairs = sources =>
  sources.map(({ label, url }) => ({
    id: Math.random(),
    key: label,
    value: url
  }))

export const keyValuePairsToSources = list =>
  list
    .map(({ key, value }) => ({ label: key, url: value }))
    .filter(({ label, url }) => label !== '' && url !== '')

export const canSubmit = (node, { answer, sources }) => {
  if (answer.length === 0) return false
  if (answer === node.answer?.content) {
    if (
      sources ===
      JSON.stringify((node.answer?.sources || []).map(({ label, url }) => ({ label, url })))
    ) {
      return false
    }
  }

  return true
}
