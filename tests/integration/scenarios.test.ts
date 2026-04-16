import { buildSystemPrompt, buildUserMessage } from '@/lib/systemPrompt'
import type { AthleteFormData } from '@/lib/types'

// Compute these once — they are pure functions with no side effects
const systemPrompt = buildSystemPrompt()

function makeFixture(overrides: Partial<AthleteFormData>): AthleteFormData {
  return {
    outcomeDescription: 'Build a complete periodized program for this athlete',
    sport: 'Football',
    position: 'OL (Guard/Tackle)',
    season: 'off-season',
    trainingDays: 4,
    heightFt: 6,
    heightIn: 2,
    bodyWeight: 280,
    trainingAge: 'intermediate',
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
    ...overrides,
  }
}

describe('PRD Evaluation Scenarios — structural output requirements', () => {
  /**
   * T01: Football OL, off-season
   * - buildUserMessage contains "Football"
   * - buildSystemPrompt contains linemen rule
   */
  describe('T01: Football OL (off-season)', () => {
    const data = makeFixture({
      sport: 'Football',
      position: 'OL (Guard/Tackle)',
      season: 'off-season',
      outcomeDescription: 'Develop maximal strength and explosiveness for fall camp as an offensive lineman',
    })

    it('buildUserMessage contains "Football"', () => {
      expect(buildUserMessage(data)).toContain('Football')
    })

    it('buildSystemPrompt contains linemen-specific programming rule', () => {
      expect(systemPrompt).toContain('linemen')
    })
  })

  /**
   * T02: Volleyball MB, in-season
   * - buildUserMessage contains "in-season"
   * - buildSystemPrompt contains patellar tendinopathy rule
   */
  describe('T02: Volleyball Middle Blocker (in-season)', () => {
    const data = makeFixture({
      sport: 'Volleyball',
      position: 'Middle Blocker',
      season: 'in-season',
      outcomeDescription: 'Maintain strength and explosive power throughout the competition season',
    })

    it('buildUserMessage contains "in-season"', () => {
      expect(buildUserMessage(data)).toContain('in-season')
    })

    it('buildSystemPrompt contains patellar tendinopathy flag', () => {
      expect(systemPrompt).toContain('patellar')
    })
  })

  /**
   * T03: Baseball SP, in-season
   * - buildUserMessage contains "Baseball"
   * - buildSystemPrompt contains overhead pressing restriction
   */
  describe('T03: Baseball Starting Pitcher (in-season)', () => {
    const data = makeFixture({
      sport: 'Baseball',
      position: 'SP (Starting Pitcher)',
      season: 'in-season',
      outcomeDescription: 'Maintain upper body health and lower body power during the competition season',
    })

    it('buildUserMessage contains "Baseball"', () => {
      expect(buildUserMessage(data)).toContain('Baseball')
    })

    it('buildSystemPrompt contains overhead pressing restriction rule', () => {
      expect(systemPrompt).toContain('overhead pressing')
    })
  })

  /**
   * T04: Women's Soccer, pre-season
   * - buildUserMessage contains "Soccer"
   * - buildSystemPrompt contains Nordic curl rule
   */
  describe("T04: Women's Soccer (pre-season)", () => {
    const data = makeFixture({
      sport: "Soccer (Women's)",
      position: 'CM',
      season: 'pre-season',
      outcomeDescription: 'Build pre-season power and injury resilience for the upcoming competitive season',
    })

    it('buildUserMessage contains "Soccer"', () => {
      expect(buildUserMessage(data)).toContain('Soccer')
    })

    it('buildSystemPrompt contains Nordic curl rule for field sports', () => {
      expect(systemPrompt).toContain('Nordic')
    })
  })

  /**
   * T05: Distance runner, off-season
   * - buildUserMessage contains "cross" or "Track"
   * - buildSystemPrompt contains concurrent training interference rule
   */
  describe('T05: Cross Country Distance Runner (off-season)', () => {
    const data = makeFixture({
      sport: 'Cross Country',
      position: 'Top 7 (Scoring)',
      season: 'off-season',
      outcomeDescription: 'Develop strength and power without compromising aerobic base development',
    })

    it('buildUserMessage contains "cross" (cross country) or "Track"', () => {
      const message = buildUserMessage(data)
      const hasCross = message.toLowerCase().includes('cross')
      const hasTrack = message.includes('Track')
      expect(hasCross || hasTrack).toBe(true)
    })

    it('buildSystemPrompt contains concurrent training interference rule', () => {
      expect(systemPrompt).toContain('concurrent')
    })
  })

  /**
   * T06: Wrestler (cutting weight)
   * - buildUserMessage contains "Wrestling"
   * - buildSystemPrompt contains weight cutting acknowledgment
   */
  describe('T06: Wrestler cutting weight', () => {
    const data = makeFixture({
      sport: 'Wrestling',
      position: '157 lbs',
      season: 'in-season',
      outcomeDescription: 'Maintain strength and power while managing weight during the competitive season',
      additionalNotes: 'Currently cutting from 165 to make 157 weight class',
    })

    it('buildUserMessage contains "Wrestling"', () => {
      expect(buildUserMessage(data)).toContain('Wrestling')
    })

    it('buildSystemPrompt contains weight cutting acknowledgment rule', () => {
      expect(systemPrompt).toContain('cutting')
    })
  })

  /**
   * T07: Basketball PG, in-season
   * - buildUserMessage contains "Basketball"
   * - buildSystemPrompt contains in-season maintenance rule
   */
  describe('T07: Basketball Point Guard (in-season)', () => {
    const data = makeFixture({
      sport: "Basketball (Men's)",
      position: 'PG',
      season: 'in-season',
      outcomeDescription: 'Maintain strength and explosiveness during the long college basketball season',
    })

    it('buildUserMessage contains "Basketball"', () => {
      expect(buildUserMessage(data)).toContain('Basketball')
    })

    it('buildSystemPrompt contains in-season maintenance protocol', () => {
      expect(systemPrompt).toContain('maintenance')
    })
  })

  /**
   * T08: Women's Gymnastics
   * - buildUserMessage contains "Gymnastics"
   * - buildSystemPrompt contains RED-S mandatory flag
   */
  describe("T08: Women's Gymnastics", () => {
    const data = makeFixture({
      sport: "Gymnastics (Women's)",
      position: 'All-Around',
      season: 'in-season',
      outcomeDescription: 'Maintain injury prevention focus and relative strength throughout the gymnastics season',
    })

    it('buildUserMessage contains "Gymnastics"', () => {
      expect(buildUserMessage(data)).toContain('Gymnastics')
    })

    it('buildSystemPrompt contains RED-S mandatory flag for female aesthetic athletes', () => {
      expect(systemPrompt).toContain('RED-S')
    })
  })

  /**
   * T09: ACL injury history
   * - buildUserMessage contains "ACL"
   * - buildSystemPrompt contains Return-to-play safety rule
   */
  describe('T09: ACL injury history', () => {
    const data = makeFixture({
      sport: 'Soccer (Women\'s)',
      position: 'LB/RB',
      season: 'off-season',
      outcomeDescription: 'Safely rebuild strength and return to full performance after ACL reconstruction',
      injuryHistory: 'ACL reconstruction left knee, cleared 18 months ago',
    })

    it('buildUserMessage contains "ACL"', () => {
      expect(buildUserMessage(data)).toContain('ACL')
    })

    it('buildSystemPrompt contains Return-to-play safety rule', () => {
      expect(systemPrompt).toContain('Return-to-play')
    })
  })

  /**
   * T10: True freshman football
   * - buildUserMessage contains "Football"
   * - buildSystemPrompt contains Novice training age rules
   */
  describe('T10: True freshman football player', () => {
    const data = makeFixture({
      sport: 'Football',
      position: 'WR',
      season: 'off-season',
      trainingAge: 'novice',
      outcomeDescription: 'Introduce structured strength training to a true freshman with limited weight room experience',
      additionalNotes: 'True freshman — first time in a collegiate weight room. Limited training background.',
    })

    it('buildUserMessage contains "Football"', () => {
      expect(buildUserMessage(data)).toContain('Football')
    })

    it('buildSystemPrompt contains Novice training age rules', () => {
      expect(systemPrompt).toContain('Novice')
    })
  })
})
