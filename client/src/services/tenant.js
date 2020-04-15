export const getTenantName = () => {
  const { REACT_APP_PRISMA_SERVICE, NODE_ENV, REACT_APP_FAQ_URL } = process.env

  // You can override the tenant with REACT_APP_PRISMA_SERVICE
  if (REACT_APP_PRISMA_SERVICE) return REACT_APP_PRISMA_SERVICE

  // If you are in production, we retrieve the tenant from the url
  if (NODE_ENV === 'production' && !!REACT_APP_FAQ_URL) {
    const url = new URL(window.location.href).hostname
    if (url.endsWith(REACT_APP_FAQ_URL)) {
      const match = url.replace(REACT_APP_FAQ_URL, '').match(/([^.]+)/g)
      return match.join('$')
    }
  }

  // Otherwise, it's dev
  return 'dev'
}
