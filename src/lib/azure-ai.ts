// Per-model-family request tuning for the Azure AI chat completions calls.
//
// Reasoning models (gpt-5*, o-series) differ from the classic chat models in
// three ways that all three of our call sites would otherwise trip over:
//
//   1. `max_tokens` is rejected outright — they want `max_completion_tokens`.
//   2. `temperature` only accepts the default (1); 0 or 0.4 is a 400.
//   3. Reasoning tokens are drawn from the completion budget *before* any
//      content is emitted, so a low cap returns an empty string with
//      finish_reason "length" rather than an error. `reasoning_effort:
//      "minimal"` keeps the budget available for the answer, which is what we
//      want everywhere here — these are extraction and short-chat calls, not
//      problems that benefit from extended reasoning.
//
// AZURE_AI_MODEL holds an Azure *deployment* name, which is free-form and need
// not contain the model family, so the name sniff can miss. Set
// AZURE_AI_REASONING=1 (or 0) to force the decision for such a deployment.

export function isReasoningModel(model: string): boolean {
  const override = process.env.AZURE_AI_REASONING?.trim().toLowerCase()
  if (override === "1" || override === "true") return true
  if (override === "0" || override === "false") return false

  return /^(gpt-5|o1|o3|o4)\b/i.test(model.trim())
}

/**
 * Reasoning tokens still cost budget at minimal effort, so leave a little
 * headroom on top of the caller's intended output length.
 */
const REASONING_HEADROOM = 256

type ClassicParams = { temperature: number; max_tokens: number }
type ReasoningParams = { max_completion_tokens: number; reasoning_effort: "minimal" }

/**
 * Build the model-specific half of a chat.completions.create() call.
 * `temperature` and `maxTokens` express the intent; what actually gets sent
 * depends on the deployed model.
 */
export function completionTuning(
  model: string,
  intent: { temperature: number; maxTokens: number },
): ClassicParams | ReasoningParams {
  if (!isReasoningModel(model)) {
    return { temperature: intent.temperature, max_tokens: intent.maxTokens }
  }
  return {
    max_completion_tokens: intent.maxTokens + REASONING_HEADROOM,
    reasoning_effort: "minimal",
  }
}
