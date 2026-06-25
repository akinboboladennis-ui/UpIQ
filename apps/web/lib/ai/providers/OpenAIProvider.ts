import type { AIMessage, AIProvider, AIRequestOptions, AIResponse } from '../types'

// Placeholder — wire up when OpenAI key is provisioned.
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai' as const

  constructor(_apiKey: string) {
    // Reserved for future implementation.
  }

  async complete(_messages: AIMessage[], _options?: AIRequestOptions): Promise<AIResponse> {
    throw new Error('OpenAIProvider is not yet implemented. Use ClaudeProvider.')
  }
}
