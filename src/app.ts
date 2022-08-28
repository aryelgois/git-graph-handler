import express from 'express'

import { applyReplacer, parseQuery } from '~/replacer'

import { asError } from '~/utils'

const app = express()

const HTTP_BAD_REQUEST = 400

app.get('/', (req, res) => {
  try {
    const query = parseQuery(req.query)
    const result = applyReplacer(query)
    res.redirect(result)
  } catch (e) {
    const error = asError(e)
    res.status(HTTP_BAD_REQUEST).json({
      error: error.name,
      message: error.message,
    })
  }
})

export default app
