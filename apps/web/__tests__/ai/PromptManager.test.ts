import { describe, it, expect } from 'vitest'
import { PromptManager } from '../../lib/ai/PromptManager'
import { createEmptyProfileDraft } from '@upiq/shared'
import { PROFILE_ANALYSIS_VERSION } from '../../lib/ai/prompts/profileAnalysis'

describe('PromptManager', () => {
  const pm = new PromptManager()

  it('returns a system message and user message', () => {
    const draft = createEmptyProfileDraft()
    const { messages, version } = pm.buildProfileAnalysis(draft)
    expect(messages.some((m) => m.role === 'system')).toBe(true)
    expect(messages.some((m) => m.role === 'user')).toBe(true)
    expect(version).toBe(PROFILE_ANALYSIS_VERSION)
  })

  it('strips internal item IDs from the prompt', () => {
    const draft = {
      ...createEmptyProfileDraft(),
      employment: [
        { id: 'abc123', role: 'Engineer', company: 'Acme', period: '2023', description: 'Stuff' },
      ],
    }
    const { messages } = pm.buildProfileAnalysis(draft)
    const userMsg = messages.find((m) => m.role === 'user')!
    expect(userMsg.content).not.toContain('abc123')
    expect(userMsg.content).toContain('Engineer')
  })

  it('includes profile fields in the prompt', () => {
    const draft = { ...createEmptyProfileDraft(), title: 'Senior React Dev', hourlyRate: '90' }
    const { messages } = pm.buildProfileAnalysis(draft)
    const userMsg = messages.find((m) => m.role === 'user')!
    expect(userMsg.content).toContain('Senior React Dev')
    expect(userMsg.content).toContain('90')
  })
})
