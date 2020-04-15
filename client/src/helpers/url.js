const parseQueryString = text =>
  text
    ? decodeURI(text)
        .substr(1)
        .split('&')
        .map(s => s.split('='))
        .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {})
    : {}
const stringifyQueryString = params =>
  '?' +
  Object.entries(params)
    .map(p => p.join('='))
    .join('&')

export const serialize = ({ q, tags, flags, page }) => {
  const params = {}

  if (q)
    params.q = q
      .trim()
      .replace(/%/g, '%25')
      .replace(/\+/, '%2B')
      .replace(/\s/g, '+')
  if (tags && tags.length > 0) params.tags = tags.join('+').replace(/\s/g, '-')
  if (flags && flags.length > 0) {
    params.flags = tags.join('+').replace(/\s/g, '-')
  }
  if (page && page > 1) params.page = page

  return stringifyQueryString(params)
}

export const unserialize = queryString => {
  const { q, tags, flags, page } = parseQueryString(queryString)
  return {
    q: q
      ? q
          .replace(/\+/g, ' ')
          .replace(/%2B/, '+')
          .trim()
      : '',
    tags: tags ? tags.replace(/-/g, ' ').split('+') : [],
    flags: flags ? flags.replace(/-/g, ' ').split('+') : [],
    page: page > 1 ? +page : 1
  }
}

export const addToQueryString = (history, addedParams, push = false) => {
  const params = unserialize(window.location.search)

  const qs = serialize({
    ...params,
    ...addedParams
  })

  history[push ? 'push' : 'replace']({
    search: qs
  })
}
