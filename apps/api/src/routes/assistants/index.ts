// apps/api/src/routes/assistants.ts
import {
  createAssistant,
  deleteAssistant,
  getAssistantById,
  getAssistantsByProjectId,
  updateAssistant
} from '@ai-assistant/db'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const CreateAssistantSchema = z.object({
  externalId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  instructions: z.string(),
  model: z.string(),
  projectId: z.string().uuid(),
  tools: z.array(z.object({ type: z.string() }))
})

const UpdateAssistantSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  model: z.string().optional(),
  tools: z.array(z.object({ type: z.string() })).optional()
})

export async function assistantsRoutes(app: FastifyInstance) {
  app.get('/assistants/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const [assistant] = await getAssistantById(id)
    if (!assistant) return res.status(404).send({ error: 'Not found' })
    return res.send(assistant)
  })

  app.get('/projects/:projectId/assistants', async (req, res) => {
    const { projectId } = req.params as { projectId: string }
    const assistants = await getAssistantsByProjectId(projectId)
    return res.send(assistants)
  })

  app.post('/assistants', async (req, res) => {
    const parsed = CreateAssistantSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error)
    const [assistant] = await createAssistant(parsed.data)
    return res.status(201).send(assistant)
  })

  app.patch('/assistants/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const parsed = UpdateAssistantSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).send(parsed.error)
    const [updated] = await updateAssistant(id, parsed.data)
    if (!updated) return res.status(404).send({ error: 'Not found' })
    return res.send(updated)
  })

  app.delete('/assistants/:id', async (req, res) => {
    const { id } = req.params as { id: string }
    const [deleted] = await deleteAssistant(id)
    if (!deleted) return res.status(404).send({ error: 'Not found' })
    return res.send(deleted)
  })
}
