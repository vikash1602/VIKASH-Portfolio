/* ===========================================================================
   POST /api/chat — the ONLY endpoint the browser talks to.
   - Reads GROQ_API_KEY from the server environment (never from the request).
   - Rebuilds the trusted system prompt + retrieved knowledge on every request.
   - The browser never sends roles, system prompts or the knowledge base.
   Returns JSON: { reply } | { error, retryAfter? }.
   ======================================================================== */
export const prerender = false; // on-demand serverless function (pages stay static)

import {
  buildSystemPrompt,
  callGroq,
  getChatConfig,
  localResponse,
  rateLimit,
  retrieveContext,
  validateChat,
  ChatValidationError,
} from '../../server/chatbot';

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

export async function POST({ request }: { request: Request }) {
  const config = getChatConfig();
  if (!config.enabled) {
    return json({ error: 'Folio is currently switched off.' }, 503);
  }

  // Best-effort soft brake (per serverless instance). Production-grade global
  // limiting belongs in Vercel Firewall rate rules — documented in the README.
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return json(
      { error: "Folio needs a short breather 😅 — please try again in a minute!", retryAfter: limit.retryAfterSeconds },
      429,
      limit.retryAfterSeconds ? { 'Retry-After': String(limit.retryAfterSeconds) } : {},
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  let validated;
  try {
    validated = validateChat(body);
  } catch (err) {
    const friendly = err instanceof ChatValidationError ? err.message : 'Invalid request.';
    return json({ error: friendly }, 400);
  }

  // Clearly off-topic / greeting messages: answer locally, save the free-tier quota.
  const local = localResponse(validated.message);
  if (local) {
    return json({ reply: local, local: true });
  }

  const context = retrieveContext(validated.message);
  const systemPrompt = buildSystemPrompt(context);
  const result = await callGroq(config, systemPrompt, validated.history, validated.message);

  if (!result.ok) {
    // Friendly, visitor-safe errors only — never echo provider internals here.
    return json(
      { error: result.friendly, kind: result.kind, retryAfter: result.retryAfterSeconds },
      result.kind === 'quota' ? 429 : 502,
      result.retryAfterSeconds ? { 'Retry-After': String(result.retryAfterSeconds) } : {},
    );
  }

  return json({ reply: result.reply });
}

export async function GET() {
  return json({ error: 'Use POST to talk to Folio.' }, 405);
}
