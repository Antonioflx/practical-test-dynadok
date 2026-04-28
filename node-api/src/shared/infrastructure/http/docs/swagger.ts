import path from 'path'
import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'LLM Summarizer API',
			version: '1.0.0',
			description: 'REST API for text summarization via LangChain',
		},
		components: {
			schemas: {
				Task: {
					type: 'object',
					required: ['id', 'text', 'lang'],
					properties: {
						id: {
							type: 'string',
							format: 'uuid',
							example: '550e8400-e29b-41d4-a716-446655440000',
						},
						text: {
							type: 'string',
							example: 'A IA está transformando a medicina moderna.',
						},
						summary: {
							type: 'string',
							nullable: true,
							example: 'IA transforma medicina.',
						},
						lang: {
							type: 'string',
							enum: ['pt', 'en', 'es'],
							example: 'pt',
						},
					},
				},
				CreateTaskInput: {
					type: 'object',
					required: ['text', 'lang'],
					properties: {
						text: {
							type: 'string',
							example: 'A IA está transformando a medicina moderna.',
						},
						lang: {
							type: 'string',
							enum: ['pt', 'en', 'es'],
							example: 'pt',
						},
					},
				},
				Error: {
					type: 'object',
					properties: {
						error: {
							type: 'string',
							example: 'Language not supported',
						},
					},
				},
			},
		},
	},
	apis: [
		path.join(__dirname, '../../../../modules/**/*.ts'), // dev (ts-node-dev)
		path.join(__dirname, '../../../../modules/**/*.js'), // production (dist/)
	],
}

export const spec = swaggerJsdoc(options)
