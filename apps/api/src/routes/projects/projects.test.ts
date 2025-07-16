// apps/api/src/routes/projects/projects.test.ts
import { db, projects } from '@ai-assistant/db'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import build from '../../app'

let app: Awaited<ReturnType<typeof build>>
let projectId: string

describe('Projects API routes', () => {
  beforeAll(async () => {
    app = await build()
  })

  afterAll(async () => {
    if (projectId) {
      await db.delete(projects).where(eq(projects.id, projectId))
    }
  })

  it('POST /projects - should create a project', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/projects',
      payload: {
        name: 'Test Project',
        description: 'Test Description'
      }
    })

    expect(response.statusCode).toBe(201)
    const body = await response.json()
    expect(body.name).toBe('Test Project')
    expect(body.description).toBe('Test Description')
    projectId = body.id
  })

  it('GET /projects/:id - should retrieve the project', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/projects/${projectId}`
    })

    expect(response.statusCode).toBe(200)
    const body = await response.json()
    expect(body.id).toBe(projectId)
    expect(body.name).toBe('Test Project')
  })

  it('GET /projects/:id - should return 404 if not found', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/projects/11111111-1111-1111-1111-111111111111'
    })

    expect(response.statusCode).toBe(404)
  })

  it('GET /projects - should return list of projects', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/projects'
    })

    expect(response.statusCode).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
  })

  it('PATCH /projects/:id - should update project name', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/projects/${projectId}`,
      payload: {
        name: 'Updated Name'
      }
    })

    expect(response.statusCode).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('Updated Name')
  })

  it('PATCH /projects/:id - should return 404 for non-existent ID', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/projects/11111111-1111-1111-1111-111111111111',
      payload: { name: 'Nope' }
    })

    expect(response.statusCode).toBe(404)
  })

  it('DELETE /projects/:id - should delete the project', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/projects/${projectId}`
    })

    expect(response.statusCode).toBe(200)
    const body = await response.json()
    expect(body.id).toBe(projectId)

    const check = await app.inject({
      method: 'GET',
      url: `/projects/${projectId}`
    })

    expect(check.statusCode).toBe(404)
    projectId = '' // Clear to avoid afterAll attempt
  })

  it('DELETE /projects/:id - should return 404 if not found', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/projects/11111111-1111-1111-1111-111111111111'
    })

    expect(response.statusCode).toBe(404)
  })
})
