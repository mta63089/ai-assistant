import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fp from 'fastify-plugin'
import { mkdirSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
mkdirSync(UPLOAD_DIR, { recursive: true })

export default fp(async (fastify) => {
  await fastify.register(fastifyMultipart)
  await fastify.register(fastifyStatic, {
    root: UPLOAD_DIR,
    prefix: '/files/'
  })

  fastify.post('/upload', async (req, res) => {
    const parts = req.parts()

    for await (const part of parts) {
      if (part.type === 'file') {
        const filePath = path.join(UPLOAD_DIR, part.filename!)
        const writeStream = await fs.open(filePath, 'w')
        part.file.pipe(writeStream.createWriteStream())
      }
    }

    return res.send({ status: 'ok' })
  })
})
