/**
 * Model transport layer for Vizon.
 *
 * This file is a stateless communication abstraction for language models.
 * It sends prompts and returns raw text. Nothing more.
 *
 * Extraction, validation, retry logic, and scoring all live elsewhere.
 * Model swapping must not affect any business logic — callers depend only
 * on ModelRequest/ModelResponse, never on provider internals.
 *
 * This abstraction enables future multi-model orchestration by keeping
 * provider details fully encapsulated behind a single interface.
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Supported model providers.
 */
export type ModelProvider = "openai" | "anthropic";

/**
 * Request contract for model calls.
 * All fields except `prompt` are optional with sensible defaults.
 */
export interface ModelRequest {
  prompt: string;
  model?: string;
  provider?: ModelProvider;
  temperature?: number;
}

/**
 * Response contract returned from model calls.
 * Contains only raw text — no parsing or interpretation.
 */
export interface ModelResponse {
  rawText: string;
}

/**
 * Sends a prompt to the specified model provider and returns raw text.
 *
 * Defaults: provider="openai", model="gpt-4o-mini", temperature=0.
 */
export async function callModel(
  request: ModelRequest
): Promise<ModelResponse> {
  const provider = request.provider ?? "openai";
  const temperature = request.temperature ?? 0;

  switch (provider) {
    case "openai":
      return callOpenAI(request.prompt, request.model ?? "gpt-4o-mini", temperature);
    case "anthropic":
      return callAnthropic(request.prompt, request.model ?? "claude-3-5-sonnet-20241022", temperature);
    default:
      throw new Error(`Unsupported model provider: ${provider}`);
  }
}

// Upstream layers depend on deterministic failure — silent empty responses
// are not acceptable in a diagnostic pipeline.
async function callOpenAI(
  prompt: string,
  model: string,
  temperature: number
): Promise<ModelResponse> {
  // Fail fast if the key is missing rather than sending an unauthorized request.
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model,
    temperature,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.choices[0]?.message?.content;
  if (!rawText) {
    throw new Error("OpenAI response contained no message content");
  }

  return { rawText };
}

async function callAnthropic(
  prompt: string,
  model: string,
  temperature: number
): Promise<ModelResponse> {
  // Fail fast if the key is missing rather than sending an unauthorized request.
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY environment variable");
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content
    .flatMap((block) => (block.type === "text" ? block.text : []))
    .join("");

  if (!rawText) {
    throw new Error("Anthropic response contained no text content");
  }

  return { rawText };
}
