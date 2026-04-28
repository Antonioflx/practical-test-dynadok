export interface ILLMService {
	summarize(text: string, lang: string): Promise<string>
}
