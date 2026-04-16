import { z } from 'zod'

export const athleteFormSchema = z.object({
  outcomeDescription: z.string().min(10, 'Please describe the outcome goal (at least 10 characters)').max(1000),
  sport: z.string().min(1, 'Sport is required'),
  position: z.string().min(1, 'Position is required'),
  season: z.enum(['off-season', 'pre-season', 'in-season', 'post-season']),
  trainingDays: z.number().min(1).max(7),
  heightFt: z.number().min(3).max(8),
  heightIn: z.number().min(0).max(11),
  bodyWeight: z.number().min(60).max(500),
  trainingAge: z.enum(['novice', 'intermediate', 'advanced', '']),
  squatMax: z.string().max(10),
  deadliftMax: z.string().max(10),
  benchMax: z.string().max(10),
  cleanMax: z.string().max(10),
  vertJump: z.string().max(10),
  tenYardDash: z.string().max(10),
  pullUpMax: z.string().max(10),
  injuryHistory: z.string().max(1000),
  practiceNotes: z.string().max(500),
  equipmentConstraints: z.string().max(500),
  additionalNotes: z.string().max(500),
})

export type AthleteFormInput = z.infer<typeof athleteFormSchema>
