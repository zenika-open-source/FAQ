import routing from '@services/routing'

export default async function safeFetch(path) {
  const response = await fetch(import.meta.env.VITE_REST_ENDPOINT + '/' + path, {
    headers: { 'prisma-service': routing.getPrismaService() }
  })

  if (!response.ok) {
    throw new Error(
      `Error response from server while retrieving ${path}: HTTP status ${
        response.status
      } : ${await response.text()}`
    )
  }

  return response.json()
}
