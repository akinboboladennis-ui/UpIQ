import type { ProfileDraft } from '@upiq/shared'
import type { AIAnalysisResult, AIProvider } from './types'
import { PromptManager } from './PromptManager'
import { parseAIResponse, JSONValidationError } from './JSONValidator'
import { withRetry } from './RetryManager'
import { blendScores } from './ScoringEngine'
import { logAIError } from './ErrorHandler'

export class AIService {
  private readonly promptManager = new PromptManager()

  constructor(private readonly provider: AIProvider) {}

  async analyzeProfile(draft: ProfileDraft): Promise<AIAnalysisResult> {
    const { messages, version } = this.promptManager.buildProfileAnalysis(draft)

    const response = await withRetry(() => this.provider.complete(messages, { temperature: 0.3 }), {
      maxAttempts: 3,
    })

    let result: AIAnalysisResult
    try {
      result = parseAIResponse(response.content, {
        promptVersion: version,
        provider: response.provider,
        model: response.model,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        latencyMs: response.latencyMs,
      })
    } catch (err) {
      logAIError('analyzeProfile.parseAIResponse', err)
      if (err instanceof JSONValidationError) {
        // One retry with explicit JSON reminder.
        const retryMessages = [
          ...messages,
          { role: 'assistant' as const, content: response.content },
          {
            role: 'user' as const,
            content: 'Your response was not valid JSON. Return ONLY the JSON object, no markdown.',
          },
        ]
        const retryResponse = await this.provider.complete(retryMessages, { temperature: 0 })
        result = parseAIResponse(retryResponse.content, {
          promptVersion: version,
          provider: retryResponse.provider,
          model: retryResponse.model,
          inputTokens: response.inputTokens + retryResponse.inputTokens,
          outputTokens: response.outputTokens + retryResponse.outputTokens,
          latencyMs: response.latencyMs + retryResponse.latencyMs,
        })
      } else {
        throw err
      }
    }

    result.score = blendScores(result.score, draft)
    return result
  }
}
