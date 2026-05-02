import {Hono} from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({message: 'Hello from Workers!'}))
app.get('/posts', (c) => c.json({posts: []}))

export default app
