import { apiReference } from '@scalar/express-api-reference'
import express, { type Application, type Request, type Response } from 'express'
import tasksRoutes from './modules/task/infrastructure/http/tasksRoutes'
import { spec } from './shared/infrastructure/http/docs/swagger'

const app: Application = express()
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
	res.json({ message: 'API is running' })
})

app.get('/openapi.json', (_req: Request, res: Response) => {
	res.json(spec)
})

app.use(
	'/docs',
	apiReference({
		url: '/openapi.json',
	}),
)

app.use('/tasks', tasksRoutes)

export default app
