import { NextRequest } from 'next/server'
import type { AthleteFormData } from '@/lib/types'

// Mock must be declared before import of the module under test.
// __esModule: true is required so ts-jest treats the factory return as an ES
// module and routes `import Anthropic from '@anthropic-ai/sdk'` to `default`.
const mockStreamFactory = () => ({
  [Symbol.asyncIterator]: async function* () {
    yield {
      type: 'content_block_delta',
      delta: { type: 'text_delta', text: '## REASONING\nTest program output.' },
    }
  },
})

const mockAnthropicConstructor = jest.fn().mockImplementation(() => ({
  messages: {
    stream: jest.fn().mockReturnValue(mockStreamFactory()),
  },
}))

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: mockAnthropicConstructor,
}))

// Import after mock is set up
import { POST } from '../../src/app/api/generate/route'

const validFixture: AthleteFormData = {
  outcomeDescription: 'Make him stronger and faster for fall camp this season',
  sport: 'Football',
  position: 'Offensive Lineman',
  season: 'off-season',
  trainingDays: 4,
  heightFt: 6,
  heightIn: 4,
  bodyWeight: 290,
  trainingAge: 'intermediate',
  squatMax: '405',
  deadliftMax: '455',
  benchMax: '315',
  cleanMax: '225',
  vertJump: '26',
  tenYardDash: '1.72',
  pullUpMax: '8',
  injuryHistory: '',
  practiceNotes: '',
  equipmentConstraints: '',
  additionalNotes: '',
}

function makeRequest(body: unknown, ip: string): NextRequest {
  return new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
  })
}

describe('POST /api/generate', () => {
  describe('valid request', () => {
    it('returns 200 with streaming text for a valid request', async () => {
      const request = makeRequest({ formData: validFixture }, '10.0.0.1')
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/plain')
    })

    it('streams text content in the response body', async () => {
      const request = makeRequest({ formData: validFixture }, '10.0.0.2')
      const response = await POST(request)

      expect(response.status).toBe(200)
      const text = await response.text()
      expect(text).toContain('## REASONING')
    })
  })

  describe('validation errors', () => {
    it('returns 400 when formData is missing entirely', async () => {
      const request = makeRequest({}, '10.0.0.3')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })

    it('returns 400 when formData is null', async () => {
      const request = makeRequest({ formData: null }, '10.0.0.4')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })

    it('returns 400 with validation error for invalid season value', async () => {
      const invalidData = { ...validFixture, season: 'mid-season' }
      const request = makeRequest({ formData: invalidData }, '10.0.0.5')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('Validation')
    })

    it('returns 400 with validation error when outcomeDescription is too short', async () => {
      const invalidData = { ...validFixture, outcomeDescription: 'Too short' }
      const request = makeRequest({ formData: invalidData }, '10.0.0.6')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('Validation')
    })

    it('returns 400 with details property on validation failure', async () => {
      const invalidData = { ...validFixture, trainingDays: 0 }
      const request = makeRequest({ formData: invalidData }, '10.0.0.7')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toHaveProperty('details')
    })

    it('returns 400 with invalid JSON body', async () => {
      const request = new NextRequest('http://localhost/api/generate', {
        method: 'POST',
        body: 'not valid json{{{',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '10.0.0.8',
        },
      })
      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })

    it('returns 400 when trainingDays is out of range', async () => {
      const invalidData = { ...validFixture, trainingDays: 8 }
      const request = makeRequest({ formData: invalidData }, '10.0.0.9')
      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('returns 400 when bodyWeight is out of range', async () => {
      const invalidData = { ...validFixture, bodyWeight: 501 }
      const request = makeRequest({ formData: invalidData }, '10.0.0.10')
      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('rate limiting', () => {
    it('returns 429 when the same IP exceeds the rate limit', async () => {
      const ip = '10.0.1.1'
      // First request should succeed
      const firstRequest = makeRequest({ formData: validFixture }, ip)
      const firstResponse = await POST(firstRequest)
      expect(firstResponse.status).toBe(200)

      // Second request from the same IP within the window should be rate limited
      const secondRequest = makeRequest({ formData: validFixture }, ip)
      const secondResponse = await POST(secondRequest)
      expect(secondResponse.status).toBe(429)
    })

    it('rate limit error body contains error message', async () => {
      const ip = '10.0.1.2'
      // First allowed
      await POST(makeRequest({ formData: validFixture }, ip))
      // Second triggers rate limit
      const response = await POST(makeRequest({ formData: validFixture }, ip))

      expect(response.status).toBe(429)
      const body = await response.json()
      expect(body).toHaveProperty('error')
      expect(body.error).toContain('Rate limit')
    })
  })
})
