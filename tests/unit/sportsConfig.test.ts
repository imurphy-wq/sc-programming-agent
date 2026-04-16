import { SPORTS, SPORT_KEYS, SPORT_OPTIONS } from '../../config/sports'
import * as sportsConfigModule from '@/lib/sportsConfig'

describe('SPORTS object (config/sports.ts)', () => {
  it('is not empty and has at least 10 sports', () => {
    expect(Object.keys(SPORTS).length).toBeGreaterThanOrEqual(10)
  })

  it('every sport entry has a label string', () => {
    for (const [key, sport] of Object.entries(SPORTS)) {
      expect(typeof sport.label).toBe('string')
      expect(sport.label.length).toBeGreaterThan(0)
    }
  })

  it('every sport entry has a positions array with at least 1 position', () => {
    for (const [key, sport] of Object.entries(SPORTS)) {
      expect(Array.isArray(sport.positions)).toBe(true)
      expect(sport.positions.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('every sport entry has a valid category field', () => {
    const validCategories = [
      'field-invasion',
      'court',
      'combat',
      'endurance',
      'power-track',
      'aesthetic',
      'overhead-rotational',
      'other',
    ]
    for (const [key, sport] of Object.entries(SPORTS)) {
      expect(validCategories).toContain(sport.category)
    }
  })

  it('includes football with positions containing an OL variant', () => {
    expect(SPORTS).toHaveProperty('football')
    const footballPositions = SPORTS['football'].positions
    const hasOL = footballPositions.some(
      pos => pos.toLowerCase().includes('ol') || pos.toLowerCase().includes('offensive lineman')
    )
    expect(hasOL).toBe(true)
  })

  it('football category is field-invasion', () => {
    expect(SPORTS['football'].category).toBe('field-invasion')
  })

  it('includes volleyball', () => {
    expect(SPORTS).toHaveProperty('volleyball')
  })

  it('includes baseball', () => {
    expect(SPORTS).toHaveProperty('baseball')
  })

  it('includes wrestling with weight class positions', () => {
    expect(SPORTS).toHaveProperty('wrestling')
    expect(SPORTS['wrestling'].positions.length).toBeGreaterThan(0)
  })

  it('includes gymnastics', () => {
    const keys = Object.keys(SPORTS)
    const hasGymnastics = keys.some(k => k.startsWith('gymnastics'))
    expect(hasGymnastics).toBe(true)
  })

  it('includes cross-country', () => {
    expect(SPORTS).toHaveProperty('cross-country')
  })

  it('includes basketball', () => {
    const keys = Object.keys(SPORTS)
    const hasBasketball = keys.some(k => k.startsWith('basketball'))
    expect(hasBasketball).toBe(true)
  })
})

describe('SPORT_KEYS (config/sports.ts)', () => {
  it('is an array', () => {
    expect(Array.isArray(SPORT_KEYS)).toBe(true)
  })

  it('contains all sport keys from the SPORTS object', () => {
    const sportsKeys = Object.keys(SPORTS)
    expect(SPORT_KEYS).toEqual(sportsKeys)
  })

  it('contains "football"', () => {
    expect(SPORT_KEYS).toContain('football')
  })

  it('contains "baseball"', () => {
    expect(SPORT_KEYS).toContain('baseball')
  })

  it('contains "wrestling"', () => {
    expect(SPORT_KEYS).toContain('wrestling')
  })

  it('has the same length as the SPORTS object', () => {
    expect(SPORT_KEYS.length).toBe(Object.keys(SPORTS).length)
  })
})

describe('SPORT_OPTIONS (config/sports.ts)', () => {
  it('is an array', () => {
    expect(Array.isArray(SPORT_OPTIONS)).toBe(true)
  })

  it('each entry has a value and label property', () => {
    for (const option of SPORT_OPTIONS) {
      expect(option).toHaveProperty('value')
      expect(option).toHaveProperty('label')
      expect(typeof option.value).toBe('string')
      expect(typeof option.label).toBe('string')
    }
  })

  it('values match sport keys', () => {
    const optionValues = SPORT_OPTIONS.map(o => o.value)
    expect(optionValues).toEqual(SPORT_KEYS)
  })

  it('labels match sport labels from SPORTS', () => {
    for (const option of SPORT_OPTIONS) {
      expect(option.label).toBe(SPORTS[option.value].label)
    }
  })

  it('has the same length as SPORTS object', () => {
    expect(SPORT_OPTIONS.length).toBe(Object.keys(SPORTS).length)
  })

  it('includes a football option with the correct label', () => {
    const footballOption = SPORT_OPTIONS.find(o => o.value === 'football')
    expect(footballOption).toBeDefined()
    expect(footballOption!.label).toBe(SPORTS['football'].label)
  })
})

describe('sportsConfig.ts re-exports', () => {
  it('SPORTS re-export matches original config/sports.ts', () => {
    expect(sportsConfigModule.SPORTS).toBe(SPORTS)
  })

  it('SPORT_KEYS re-export matches original config/sports.ts', () => {
    expect(sportsConfigModule.SPORT_KEYS).toBe(SPORT_KEYS)
  })

  it('SPORT_OPTIONS re-export matches original config/sports.ts', () => {
    expect(sportsConfigModule.SPORT_OPTIONS).toBe(SPORT_OPTIONS)
  })
})
