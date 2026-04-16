import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { athleteFormSchema } from '@/lib/validation'
import { buildSystemPrompt, buildUserMessage } from '@/lib/systemPrompt'
import type { AthleteFormData } from '@/lib/types'

const ALLOWED_ORIGINS = [
  'https://imurphy-wq.github.io',
  'https://sc-programming-agent.vercel.app',
  'http://localhost:3000',
  'http://localhost:8080',
]

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Simple in-memory rate limiting (per-process, resets on restart)
const requestLog = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 30_000
const RATE_LIMIT_MAX_REQUESTS = 1

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const requests = requestLog.get(ip) ?? []
  const recent = requests.filter(t => now - t < RATE_LIMIT_WINDOW_MS)
  requestLog.set(ip, recent)
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return true
  requestLog.set(ip, [...recent, now])
  return false
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit: please wait 30 seconds between requests.' },
      { status: 429 }
    )
  }

  // Parse and validate
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = athleteFormSchema.safeParse((body as { formData?: unknown })?.formData)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const formData = parsed.data as AthleteFormData

  // Build prompts
  const systemPrompt = buildSystemPrompt()
  const userMessage = buildUserMessage(formData)

  // Stream from Claude
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        })

        for await (const chunk of claudeStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(`\n\n[ERROR: ${message}]`))
        controller.close()
      }
    },
  })

  const origin = request.headers.get('origin')
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      ...corsHeaders(origin),
    },
  })
}
