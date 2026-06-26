import type {
  ParseInput,
  ParseOutcome,
  StoredProfileRecord,
  ParsedProfile,
} from '../types/index.js'
import { parseProfile } from '../parser/index.js'
import { validateParseInput } from '../validators/index.js'

/**
 * Parse a raw profile text and return the structured result.
 * Performs input validation before parsing.
 */
export function parseAndValidate(input: ParseInput): ParseOutcome {
  const validation = validateParseInput(input)
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    }
  }
  return parseProfile(input)
}

/**
 * Build a StoredProfileRecord from a raw profile record and its parsed data.
 * The caller is responsible for persisting this to the database.
 */
export function buildStoredRecord(params: {
  profileId: string
  userId: string
  rawText: string
  parsed: ParsedProfile
}): StoredProfileRecord {
  const { profileId, userId, rawText, parsed } = params
  return {
    id: profileId,
    userId,
    rawText,
    parsedData: parsed,
    parserVersion: parsed.metadata.parserVersion,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
