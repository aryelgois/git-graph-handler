import app from './app'
import log from './log'

const port = 5000

app.listen(port, () => {
  const url = `http://localhost:${port}`
  log(`Server ready at: ${url}`)
})
