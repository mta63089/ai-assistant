// apps/api/src/routes/projects/index.ts
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject
} from '@ai-assistant/db'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional()
})

const UpdateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
})

export async function projectsRoutes(app: FastifyInstance) {
  app.get('/projects', async (_, res) => {
    const projects = await getAllProjects()
    return res.send(projects)
  })

  app.get('/projects/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const [project] = await getProjectById(id)
    if (!project) return res.status(404).send({ error: 'Not found' })
    return res.send(project)
  })

  app.post('/projects', async (req, res) => {
    const parsed = CreateProjectSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error)
    const [project] = await createProject(parsed.data)
    return res.status(201).send(project)
  })

  app.patch('/projects/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const parsed = UpdateProjectSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error)
    const [updated] = await updateProject(id, parsed.data)
    if (!updated) return res.status(404).send({ error: 'Not found' })
    return res.send(updated)
  })

  app.delete('/projects/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const [deleted] = await deleteProject(id)
    if (!deleted) return res.status(404).send({ error: 'Not found' })
    return res.send(deleted)
  })
}
