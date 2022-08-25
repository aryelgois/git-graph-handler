import express from 'express'

const app = express()

app.get('/', (_req, res) => {
  res.json({ helloWorld: 'It Works' })
})

export default app
