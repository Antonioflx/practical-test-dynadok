import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../shared/errors/HttpError'

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof HttpError) {
		return res.status(err.statusCode).json({
			statusCode: err.statusCode,
			message: err.message,
		})
	}

	console.error(err)
	return res.status(500).json({
		statusCode: 500,
		message: 'Internal server error',
	})
}
