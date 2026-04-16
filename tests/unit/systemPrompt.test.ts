import { buildSystemPrompt, buildUserMessage } from '@/lib/systemPrompt'
import type { AthleteFormData } from '@/lib/types'

const fixture: AthleteFormData = {
  outcomeDescription: 'Make him stronger and faster for fall camp',
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

describe('buildSystemPrompt', () => {
  let prompt: string

  beforeAll(() => {
    prompt = buildSystemPrompt()
  })

  it('returns a non-empty string', () => {
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(0)
  })

  it('contains the CRITICAL OUTPUT FORMAT section', () => {
    expect(prompt).toContain('CRITICAL OUTPUT FORMAT')
  })

  it('contains the FORMATTING RULES section', () => {
    expect(prompt).toContain('FORMATTING RULES')
  })

  it('contains SPORT-SPECIFIC reference', () => {
    expect(prompt).toContain('SPORT-SPECIFIC')
  })

  it('contains SAFETY RULES section', () => {
    expect(prompt).toContain('SAFETY RULES')
  })

  it('contains the table format with exercise column header', () => {
    expect(prompt).toContain('| # | EXERCISE |')
  })

  it('contains sport-specific rules for Field/Invasion sports', () => {
    expect(prompt).toContain('Field/Invasion')
  })

  it('contains sport-specific rules for Baseball', () => {
    expect(prompt).toContain('Baseball')
  })

  it('contains the Return-to-play safety rule', () => {
    expect(prompt).toContain('Return-to-play')
  })

  it('mentions linemen-specific programming rules', () => {
    expect(prompt).toContain('linemen')
  })

  it('mentions patellar tendinopathy risk for volleyball', () => {
    expect(prompt).toContain('patellar')
  })

  it('mentions overhead pressing restriction for pitchers', () => {
    expect(prompt).toContain('overhead pressing')
  })

  it('mentions Nordic curl for field sports', () => {
    expect(prompt).toContain('Nordic')
  })

  it('mentions concurrent training interference for endurance athletes', () => {
    expect(prompt).toContain('concurrent')
  })

  it('mentions weight cutting for combat sports', () => {
    expect(prompt).toContain('cutting')
  })

  it('mentions in-season maintenance for court sports', () => {
    expect(prompt).toContain('maintenance')
  })

  it('mentions RED-S flag for aesthetic sport female athletes', () => {
    expect(prompt).toContain('RED-S')
  })

  it('mentions Novice training age rules', () => {
    expect(prompt).toContain('Novice')
  })
})

describe('buildUserMessage', () => {
  it('returns a string', () => {
    const message = buildUserMessage(fixture)
    expect(typeof message).toBe('string')
    expect(message.length).toBeGreaterThan(0)
  })

  it('contains the sport name', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('Football')
  })

  it('contains the outcome description', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('Make him stronger and faster for fall camp')
  })

  it('contains the season phase', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('off-season')
  })

  it('contains the position', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('Offensive Lineman')
  })

  it('contains the body weight', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('290')
  })

  it('contains the training days', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('4')
  })

  it('contains the squat max value when it is provided', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('405')
  })

  it('contains the deadlift max value when it is provided', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('455')
  })

  it('contains "untested" when squatMax is empty', () => {
    const data: AthleteFormData = { ...fixture, squatMax: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('contains "untested" when deadliftMax is empty', () => {
    const data: AthleteFormData = { ...fixture, deadliftMax: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('contains "untested" when benchMax is empty', () => {
    const data: AthleteFormData = { ...fixture, benchMax: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('contains "untested" when cleanMax is empty', () => {
    const data: AthleteFormData = { ...fixture, cleanMax: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('contains "untested" when vertJump is empty', () => {
    const data: AthleteFormData = { ...fixture, vertJump: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('contains "untested" when tenYardDash is empty', () => {
    const data: AthleteFormData = { ...fixture, tenYardDash: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('contains "untested" when pullUpMax is empty', () => {
    const data: AthleteFormData = { ...fixture, pullUpMax: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('untested')
  })

  it('includes injury history when provided', () => {
    const data: AthleteFormData = { ...fixture, injuryHistory: 'ACL reconstruction left knee' }
    const message = buildUserMessage(data)
    expect(message).toContain('ACL reconstruction left knee')
  })

  it('does not include injury history section when empty', () => {
    const data: AthleteFormData = { ...fixture, injuryHistory: '' }
    const message = buildUserMessage(data)
    expect(message).not.toContain('INJURY HISTORY / CURRENT LIMITATIONS')
  })

  it('includes practice notes when provided', () => {
    const data: AthleteFormData = { ...fixture, practiceNotes: 'Games on Friday nights' }
    const message = buildUserMessage(data)
    expect(message).toContain('Games on Friday nights')
  })

  it('includes equipment constraints when provided', () => {
    const data: AthleteFormData = { ...fixture, equipmentConstraints: 'No bumper plates available' }
    const message = buildUserMessage(data)
    expect(message).toContain('No bumper plates available')
  })

  it('includes additional notes when provided', () => {
    const data: AthleteFormData = { ...fixture, additionalNotes: 'True freshman, first time in college weight room' }
    const message = buildUserMessage(data)
    expect(message).toContain('True freshman')
  })

  it('formats height as feet and inches', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain("6'4\"")
  })

  it('handles empty trainingAge gracefully', () => {
    const data: AthleteFormData = { ...fixture, trainingAge: '' }
    const message = buildUserMessage(data)
    expect(message).toContain('not specified')
  })

  it('includes trainingAge label when provided', () => {
    const message = buildUserMessage(fixture)
    expect(message).toContain('intermediate')
  })
})
