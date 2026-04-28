import axios from 'axios'
import type { ILLMService } from '../../application/ports/ILLMService'

export class PythonLLMClient implements ILLMService {
	private readonly baseUrl = process.env.PYTHON_LLM_URL ?? 'http://localhost:8000'

	async summarize(text: string, lang: string): Promise<string> {
		try {
			const { data } = await axios.post(`${this.baseUrl}/process`, {
				text,
				lang,
				type: 'task',
			})
			return data.summary
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				const detail = err.response?.data?.detail ?? err.response?.data ?? err.message
				throw new Error(`LLM service unreachable or failed: ${JSON.stringify(detail)}`)
			}
			throw err
		}
	}
}
