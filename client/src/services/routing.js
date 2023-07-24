const routing = {
  getQueryParam(location, name) {
    const queryParams = new URLSearchParams(location.search)
    return queryParams.get(name)
  },
  setQueryParam(location, history, name, value, replace) {
    const queryParams = new URLSearchParams(location.search)
    queryParams.set(name, value)
    const arg = {
      search: '?' + queryParams.toString(),
    }
    if (replace) {
      history.replace(arg)
    } else {
      history.push(arg)
    }
  },
  getUIDFromSlug(match) {
    return match.params.slug.split('-').pop()
  },
  getShareUrl(UID) {
    return `${window.location.origin}/q/${UID}`
  },
  getPrismaService() {
    const { VITE_PRISMA_SERVICE, NODE_ENV, VITE_FAQ_URL } = import.meta.env

    // You can override the service with VITE_PRISMA_SERVICE
    if (VITE_PRISMA_SERVICE) return VITE_PRISMA_SERVICE

    // If you are in production, we retrieve the prisma service from the url
    if (NODE_ENV === 'production' && !!VITE_FAQ_URL) {
      const url = new URL(window.location.href).hostname
      if (url.endsWith(VITE_FAQ_URL)) {
        const match = url.replace(VITE_FAQ_URL, '').match(/(?:(?:([^.]*)\.)?([^.]*)\.)?/)
        const name = match[2] || 'default'
        const stage = match[1] || 'prod'
        return name + '/' + stage
      }
    }

    // Otherwise, it's default/default
    return 'default/default'
  },
}

export default routing
