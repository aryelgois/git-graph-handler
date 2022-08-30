import { RequestHandler } from 'express'

import { applyReplacer, parseQuery } from '~/replacer'

import { asError, HTTP_BAD_REQUEST } from '~/utils'

export const replaceFromQuery: RequestHandler = (req, res) => {
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
}
