import type { AIMessage, AIProvider, AIRequestOptions, AIResponse } from '../types'

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const DEFAULT_MAX_TOKENS = 4096

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude' as const

  private readonly apiKey: string
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages'

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('ClaudeProvider: ANTHROPIC_API_KEY is required')
    this.apiKey = apiKey
  }

  async complete(messages: AIMessage[], options: AIRequestOptions = {}): Promise<AIResponse> {
    const model = options.model ?? DEFAULT_MODEL
    const startMs = Date.now()

    const body: Record<string, unknown> = {
      model,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    }

    if (options.systemPrompt) {
      body.system = options.systemPrompt
    } else {
      const sys = messages.find((m) => m.role === 'system')
      if (sys) body.system = sys.content
    }

    if (options.temperature !== undefined) {
      body.temperature = options.temperature
    }

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText)
      throw new Error(`Claude API error ${res.status}: ${err}`)
    }

    const data = (await res.json()) as {
      content: Array<{ type: string; text: string }>
      usage: { input_tokens: number; output_tokens: number }
      model: string
    }

    const content = data.content.find((c) => c.type === 'text')?.text ?? ''

    return {
      content,
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
      model: data.model,
      provider: 'claude',
      latencyMs: Date.now() - startMs,
    }
  }
}
