import { test } from '@playwright/test'
import {
  createTempUserMutation,
  createUserMutation,
  fetchPrismaToken,
  upsertConfigMutation,
  token,
  tagsQuery
} from './prisma'
const multiTenant = require('../../server/src/multiTenant')
const algolia = require('../../server/src/integrations/algolia')

let apiContext, prisma, tag, config, tagEdit, user, tempUser

const deleteAll = field => {
  return /* GraphQL */ `mutation DeleteAll{
      ${field} {
        count
      }
    }`
}

let deleteCommands = [
  'deleteManyAnswers',
  'deleteManyQuestions',
  'deleteManyHistoryActions',
  'deleteManyFlags',
  'deleteManyTags',
  'deleteManyZNodes'
]

const emptyDb = async (apiContext, commands) => {
  for (const command of commands) {
    await apiContext.post('/', {
      data: {
        query: deleteAll(command)
      }
    })
  }
}

export const beforeAll = async () => {
  test.beforeAll(async ({ playwright }) => {
    fetchPrismaToken()
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:4466',
      extraHTTPHeaders: {
        Authorization: token,
        'faq-tenant': 'default/default'
      }
    })
    prisma = multiTenant.current({
      headers: {
        'faq-tenant': 'default/default'
      }
    })
    config = await upsertConfigMutation(apiContext)
    prisma._meta = { ...prisma._meta, configuration: config.upsertConfiguration }
    user = await createUserMutation(apiContext)
    const tagResult = await tagsQuery(apiContext)
    tag = tagResult.tag
    tagEdit = tagResult.tagEdit
    tempUser = await createTempUserMutation(prisma, tag.id)
  })
  return {
    apiContext,
    prisma,
    config,
    user,
    tag,
    tagEdit,
    tempUser
  }
}

export const beforeEach = () => {
  test.beforeEach(async () => {
    await emptyDb(apiContext, deleteCommands)
  })
}

export const afterEach = () => {
  test.afterEach(async () => {
    algolia.clearIndex({ prisma })
  })
}

export const afterAll = () => {
  test.afterAll(async () => {
    deleteCommands = [...deleteCommands, 'deleteManyUsers']
    await emptyDb(apiContext, deleteCommands)
    await apiContext.dispose()
  })
}
