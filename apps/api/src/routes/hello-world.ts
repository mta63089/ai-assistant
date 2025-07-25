import { FastifyInstance } from 'fastify'

async function helloWorld(fastify: FastifyInstance) {
  fastify.get('/api/hello-world', async (request, reply) => {
    return { data: 'Hello World!' }
  })
}

export default helloWorld
