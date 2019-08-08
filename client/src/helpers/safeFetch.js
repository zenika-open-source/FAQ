import routing from 'services/routing'

export default async path => {
  const response = await fetch(process.env.REACT_APP_REST_ENDPOINT + '/' + path, {
    headers: { 'prisma-service': routing.getPrismaService() }
  })

  if (!response.ok) {
    throw new Error(
      `Error response from server while retrieving ${path}: HTTP status ${response.status}`
    )
  }

  return response.json()
}
