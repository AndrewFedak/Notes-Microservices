import { Express } from 'express'

import { bootstrap } from './server'

bootstrap().then((app: Express) => {
  const port = process.env.PORT

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})
