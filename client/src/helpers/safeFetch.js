import routing from 'services/routing'

export default async function safeFetch(path) {
  const response = await fetch('/rest/' + path, {
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
