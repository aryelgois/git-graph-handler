import express from 'express'

import { replaceFromQuery } from '~/routes/replaceFromQuery'

const app = express()

app.get('/', replaceFromQuery)

export default app
