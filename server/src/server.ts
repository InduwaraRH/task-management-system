import app from './app'
import { PORT } from './config'

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
