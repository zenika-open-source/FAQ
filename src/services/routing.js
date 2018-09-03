const routing = {
  getQueryParam(location, name) {
    const queryParams = new URLSearchParams(location.search)
    return queryParams.get(name)
  },
  setQueryParam(location, history, name, value, replace) {
    const queryParams = new URLSearchParams(location.search)
    queryParams.set(name, value)
    const arg = {
      search: '?' + queryParams.toString()
    }
    if (replace) {
      history.replace(arg)
    } else {
      history.push(arg)
    }
  },
  getUIDFromSlug(match) {
    return match.params.slug.split('-').pop()
  }
}

export default routing
