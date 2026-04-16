export interface AthleteFormData {
  // Required fields
  outcomeDescription: string
  sport: string
  position: string
  season: 'off-season' | 'pre-season' | 'in-season' | 'post-season'
  trainingDays: number

  // Athlete profile
  heightFt: number
  heightIn: number
  bodyWeight: number
  trainingAge: 'novice' | 'intermediate' | 'advanced' | ''

  // Testing maxes (empty string = untested)
  squatMax: string
  deadliftMax: string
  benchMax: string
  cleanMax: string
  vertJump: string
  tenYardDash: string
  pullUpMax: string

  // Context fields
  injuryHistory: string
  practiceNotes: string
  equipmentConstraints: string
  additionalNotes: string
}

export interface GenerateRequest {
  formData: AthleteFormData
}

export interface GenerateResponse {
  program: string
  error?: string
}

export interface SportConfig {
  label: string
  positions: string[]
  category: 'field-invasion' | 'court' | 'combat' | 'endurance' | 'power-track' | 'aesthetic' | 'overhead-rotational' | 'other'
}
