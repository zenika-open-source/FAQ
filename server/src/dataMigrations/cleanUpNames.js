/**
 * Wipes out the givenName and familyName fields of users.
 *
 * FAQ originally stored those but it turns out they are not useful,
 * and FAQ should require the least amount of personal data possible.
 *
 * Code inspired by https://github.com/marktani/scripts/blob/master/delete-nodes/delete-nodes.js
 */

const fromEvent = require('graphcool-lib').fromEvent

const listQuery = `
  query GetUsers {
    allUsers(
      filter: {
        givenName_not: null, 
        familyName_not: null
      }
    ) {
      id
    }
  }
`

const updateQuery = `
  mutation CleanUpNames($id: ID!) {
    updateUser(
      id: $id,
      givenName: null,
      familyName: null
    ) {
      id
    }
  }
`

export default async event => {
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')
  try {
    const { allUsers } = await api.request(listQuery)
    const report = await Promise.all(
      allUsers.map(async ({ id }) => {
        try {
          await api.request(updateQuery, { id })
          return { ok: true, id }
        } catch (err) {
          return { ok: false, id }
        }
      })
    )
    const succeeded = report.filter(({ ok }) => ok).map(({ id }) => id)
    const failed = report.filter(({ ok }) => !ok).map(({ id }) => id)
    console.log(`${succeeded.length} updates succeeded: ${succeeded}`)
    console.log(`${failed.length} updates failed: ${failed}`)
    return { data: { succeeded: succeeded.length, failed: failed.length } }
  } catch (err) {
    console.log(err)
    return { error: 'An unexpected error occured' }
  }
}
