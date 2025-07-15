// apps/api/src/routes/assistants/index.test.ts
import { db, deleteAssistantsWithProjectId, projects } from '@ai-assistant/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import build from '../../app'

let app: Awaited<ReturnType<typeof build>>
let testProjectId: string
let testAssistantId: string

const baseAssistant = {
  externalId: 'asst_test',
  name: 'Test Assistant',
  description: 'Used for API tests',
  instructions: 'Be helpful',
  model: 'gpt-4',
  tools: [{ type: 'code_interpreter' }]
}

describe('Assistants API routes', () => {
  beforeAll(async () => {
    app = await build()
    const [project] = await db
      .insert(projects)
      .values({
        name: 'API Project',
        description: 'Testing project'
      })
      .returning()
    testProjectId = project.id
  })

  afterAll(async () => {
    await deleteAssistantsWithProjectId(testProjectId)
  })

  it('POST /assistants - should create an assistant', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/assistants',
      payload: { ...baseAssistant, projectId: testProjectId }
    })
    const json = await res.json()
    expect(res.statusCode).toBe(201)
    expect(json.name).toBe(baseAssistant.name)
    testAssistantId = json.id
  })

  it('GET /assistants/:id - should retrieve the assistant', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/assistants/${testAssistantId}`
    })
    const json = await res.json()
    expect(res.statusCode).toBe(200)
    expect(json.id).toBe(testAssistantId)
  })

  it('GET /projects/:projectId/assistants - should list assistants by project', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/projects/${testProjectId}/assistants`
    })
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    expect(json[0].projectId).toBe(testProjectId)
  })

  it('PATCH /assistants/:id - should update assistant name', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/assistants/${testAssistantId}`,
      payload: { name: 'Updated Name' }
    })
    const json = await res.json()
    expect(res.statusCode).toBe(200)
    expect(json.name).toBe('Updated Name')
  })

  it('DELETE /assistants/:id - should delete the assistant', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/assistants/${testAssistantId}`
    })
    const json = await res.json()
    expect(res.statusCode).toBe(200)
    expect(json.id).toBe(testAssistantId)
  })

  it('GET /assistants/:id - should return 404 for deleted assistant', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/assistants/${testAssistantId}`
    })
    expect(res.statusCode).toBe(404)
  })
})
