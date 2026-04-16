import { athleteFormSchema } from '@/lib/validation'

const validComplete = {
  outcomeDescription: 'Make him stronger and faster for fall camp this season',
  sport: 'Football',
  position: 'Offensive Lineman',
  season: 'off-season' as const,
  trainingDays: 4,
  heightFt: 6,
  heightIn: 4,
  bodyWeight: 290,
  trainingAge: 'intermediate' as const,
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

const validMinimal = {
  outcomeDescription: 'Build a solid strength base for the upcoming season',
  sport: 'Soccer',
  position: 'Forward',
  season: 'pre-season' as const,
  trainingDays: 3,
  heightFt: 5,
  heightIn: 9,
  bodyWeight: 165,
  trainingAge: '' as const,
  squatMax: '',
  deadliftMax: '',
  benchMax: '',
  cleanMax: '',
  vertJump: '',
  tenYardDash: '',
  pullUpMax: '',
  injuryHistory: '',
  practiceNotes: '',
  equipmentConstraints: '',
  additionalNotes: '',
}

describe('athleteFormSchema', () => {
  describe('valid data', () => {
    it('passes with valid complete form data', () => {
      const result = athleteFormSchema.safeParse(validComplete)
      expect(result.success).toBe(true)
    })

    it('passes with valid minimal form data (only required fields, optional fields empty)', () => {
      const result = athleteFormSchema.safeParse(validMinimal)
      expect(result.success).toBe(true)
    })

    it('accepts all valid season enum values', () => {
      const seasons = ['off-season', 'pre-season', 'in-season', 'post-season'] as const
      for (const season of seasons) {
        const result = athleteFormSchema.safeParse({ ...validComplete, season })
        expect(result.success).toBe(true)
      }
    })

    it('accepts all valid trainingAge enum values', () => {
      const ages = ['novice', 'intermediate', 'advanced', ''] as const
      for (const trainingAge of ages) {
        const result = athleteFormSchema.safeParse({ ...validComplete, trainingAge })
        expect(result.success).toBe(true)
      }
    })

    it('accepts boundary trainingDays values (1 and 7)', () => {
      expect(athleteFormSchema.safeParse({ ...validComplete, trainingDays: 1 }).success).toBe(true)
      expect(athleteFormSchema.safeParse({ ...validComplete, trainingDays: 7 }).success).toBe(true)
    })

    it('accepts boundary heightFt values (3 and 8)', () => {
      expect(athleteFormSchema.safeParse({ ...validComplete, heightFt: 3, heightIn: 0 }).success).toBe(true)
      expect(athleteFormSchema.safeParse({ ...validComplete, heightFt: 8, heightIn: 0 }).success).toBe(true)
    })

    it('accepts boundary heightIn values (0 and 11)', () => {
      expect(athleteFormSchema.safeParse({ ...validComplete, heightIn: 0 }).success).toBe(true)
      expect(athleteFormSchema.safeParse({ ...validComplete, heightIn: 11 }).success).toBe(true)
    })

    it('accepts boundary bodyWeight values (60 and 500)', () => {
      expect(athleteFormSchema.safeParse({ ...validComplete, bodyWeight: 60 }).success).toBe(true)
      expect(athleteFormSchema.safeParse({ ...validComplete, bodyWeight: 500 }).success).toBe(true)
    })

    it('accepts outcomeDescription at minimum length boundary (10 chars)', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, outcomeDescription: '1234567890' })
      expect(result.success).toBe(true)
    })
  })

  describe('missing required fields', () => {
    it('fails when outcomeDescription is missing', () => {
      const { outcomeDescription: _omit, ...rest } = validComplete
      const result = athleteFormSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('fails when sport is missing', () => {
      const { sport: _omit, ...rest } = validComplete
      const result = athleteFormSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('fails when position is missing', () => {
      const { position: _omit, ...rest } = validComplete
      const result = athleteFormSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })

    it('fails when season is missing', () => {
      const { season: _omit, ...rest } = validComplete
      const result = athleteFormSchema.safeParse(rest)
      expect(result.success).toBe(false)
    })
  })

  describe('outcomeDescription validation', () => {
    it('fails when outcomeDescription is too short (less than 10 chars)', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, outcomeDescription: 'Too short' })
      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.flatten().fieldErrors
        expect(issues.outcomeDescription).toBeDefined()
      }
    })

    it('fails when outcomeDescription is exactly 9 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, outcomeDescription: '123456789' })
      expect(result.success).toBe(false)
    })

    it('fails when outcomeDescription is empty string', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, outcomeDescription: '' })
      expect(result.success).toBe(false)
    })

    it('fails when outcomeDescription exceeds 1000 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, outcomeDescription: 'a'.repeat(1001) })
      expect(result.success).toBe(false)
    })

    it('passes when outcomeDescription is exactly 1000 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, outcomeDescription: 'a'.repeat(1000) })
      expect(result.success).toBe(true)
    })
  })

  describe('season enum validation', () => {
    it('fails with an invalid season enum value', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, season: 'mid-season' })
      expect(result.success).toBe(false)
    })

    it('fails with an empty string for season', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, season: '' })
      expect(result.success).toBe(false)
    })

    it('fails with a numeric value for season', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, season: 1 })
      expect(result.success).toBe(false)
    })
  })

  describe('trainingDays range validation', () => {
    it('fails when trainingDays is 0 (below minimum)', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, trainingDays: 0 })
      expect(result.success).toBe(false)
    })

    it('fails when trainingDays is 8 (above maximum)', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, trainingDays: 8 })
      expect(result.success).toBe(false)
    })

    it('fails when trainingDays is negative', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, trainingDays: -1 })
      expect(result.success).toBe(false)
    })
  })

  describe('bodyWeight range validation', () => {
    it('fails when bodyWeight is below 60', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, bodyWeight: 59 })
      expect(result.success).toBe(false)
    })

    it('fails when bodyWeight is above 500', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, bodyWeight: 501 })
      expect(result.success).toBe(false)
    })

    it('fails when bodyWeight is 0', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, bodyWeight: 0 })
      expect(result.success).toBe(false)
    })
  })

  describe('trainingAge enum validation', () => {
    it('fails with an invalid trainingAge enum value', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, trainingAge: 'expert' })
      expect(result.success).toBe(false)
    })

    it('fails with a non-enum string for trainingAge', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, trainingAge: 'beginner' })
      expect(result.success).toBe(false)
    })
  })

  describe('string max length fields', () => {
    const maxLenFields = ['squatMax', 'deadliftMax', 'benchMax', 'cleanMax', 'vertJump', 'tenYardDash', 'pullUpMax'] as const

    for (const field of maxLenFields) {
      it(`fails when ${field} exceeds 10 chars`, () => {
        const result = athleteFormSchema.safeParse({ ...validComplete, [field]: '12345678901' })
        expect(result.success).toBe(false)
      })

      it(`passes when ${field} is exactly 10 chars`, () => {
        const result = athleteFormSchema.safeParse({ ...validComplete, [field]: '1234567890' })
        expect(result.success).toBe(true)
      })
    }

    it('fails when injuryHistory exceeds 1000 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, injuryHistory: 'a'.repeat(1001) })
      expect(result.success).toBe(false)
    })

    it('fails when practiceNotes exceeds 500 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, practiceNotes: 'a'.repeat(501) })
      expect(result.success).toBe(false)
    })

    it('fails when equipmentConstraints exceeds 500 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, equipmentConstraints: 'a'.repeat(501) })
      expect(result.success).toBe(false)
    })

    it('fails when additionalNotes exceeds 500 chars', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, additionalNotes: 'a'.repeat(501) })
      expect(result.success).toBe(false)
    })
  })

  describe('sport and position string validation', () => {
    it('fails when sport is empty string', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, sport: '' })
      expect(result.success).toBe(false)
    })

    it('fails when position is empty string', () => {
      const result = athleteFormSchema.safeParse({ ...validComplete, position: '' })
      expect(result.success).toBe(false)
    })
  })
})
