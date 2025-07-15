// apps/api/src/server.ts
import 'dotenv/config'
import app from './app'

const server = app()

server.listen(
  { port: Number(process.env.PORT) | 3001 },
  function (err, address) {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
    console.clear()

    console.log('AI is booting up...')

    setTimeout(() => {
      console.clear()
      console.log(`Server ready at ${address}`)
    }, 5000)
  }
)
