import type { SportConfig } from '@/lib/types'

export const SPORTS: Record<string, SportConfig> = {
  'football': {
    label: 'Football (American)',
    positions: ['QB', 'RB', 'FB', 'WR', 'TE', 'OL (Guard/Tackle)', 'OL (Center)', 'DL (DT)', 'DL (DE)', 'LB (ILB)', 'LB (OLB)', 'CB', 'Safety', 'K/P', 'ATH'],
    category: 'field-invasion',
  },
  'soccer-m': {
    label: "Soccer (Men's)",
    positions: ['GK', 'CB', 'LB/RB', 'CDM', 'CM', 'CAM', 'LW/RW', 'ST'],
    category: 'field-invasion',
  },
  'soccer-w': {
    label: "Soccer (Women's)",
    positions: ['GK', 'CB', 'LB/RB', 'CDM', 'CM', 'CAM', 'LW/RW', 'ST'],
    category: 'field-invasion',
  },
  'lacrosse-m': {
    label: "Lacrosse (Men's)",
    positions: ['GK', 'Defense', 'LSM (Long Stick Midfield)', 'Midfield', 'Attack', 'ATH'],
    category: 'field-invasion',
  },
  'lacrosse-w': {
    label: "Lacrosse (Women's)",
    positions: ['GK', 'Defense', 'Midfield', 'Attack', 'ATH'],
    category: 'field-invasion',
  },
  'field-hockey': {
    label: 'Field Hockey',
    positions: ['GK', 'Defense', 'Midfield', 'Forward'],
    category: 'field-invasion',
  },
  'rugby': {
    label: 'Rugby',
    positions: ['Prop', 'Hooker', 'Lock', 'Flanker', 'No. 8', 'Scrum-half', 'Fly-half', 'Center', 'Wing', 'Fullback'],
    category: 'field-invasion',
  },
  'basketball-m': {
    label: "Basketball (Men's)",
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    category: 'court',
  },
  'basketball-w': {
    label: "Basketball (Women's)",
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    category: 'court',
  },
  'volleyball': {
    label: 'Volleyball',
    positions: ['Setter', 'Middle Blocker', 'Outside Hitter', 'Opposite Hitter', 'Libero', 'Defensive Specialist'],
    category: 'court',
  },
  'tennis': {
    label: 'Tennis',
    positions: ['Singles', 'Doubles', 'Both'],
    category: 'court',
  },
  'baseball': {
    label: 'Baseball',
    positions: ['SP (Starting Pitcher)', 'RP/Closer', 'Catcher', '1B', '2B', '3B', 'SS', 'OF', 'DH/Utility'],
    category: 'overhead-rotational',
  },
  'softball': {
    label: 'Softball',
    positions: ['SP (Starting Pitcher)', 'Relief Pitcher', 'Catcher', '1B', '2B', '3B', 'SS', 'OF', 'DP/Utility'],
    category: 'overhead-rotational',
  },
  'wrestling': {
    label: 'Wrestling',
    positions: ['125 lbs', '133 lbs', '141 lbs', '149 lbs', '157 lbs', '165 lbs', '174 lbs', '184 lbs', '197 lbs', '285 lbs (HWT)'],
    category: 'combat',
  },
  'swimming': {
    label: 'Swimming',
    positions: ['Sprint Freestyle (50/100)', 'Mid Free (200)', 'Distance Free (500/1000/1650)', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'],
    category: 'endurance',
  },
  'rowing': {
    label: 'Rowing',
    positions: ['Sweep (8+)', 'Sweep (4+)', 'Scull (1x)', 'Scull (2x/4x)', 'Coxswain'],
    category: 'endurance',
  },
  'cross-country': {
    label: 'Cross Country',
    positions: ['Top 7 (Scoring)', 'Non-scoring', 'General'],
    category: 'endurance',
  },
  'track-sprint': {
    label: 'Track - Sprints/Hurdles',
    positions: ['100m/200m', '400m', '110m/100m Hurdles', '400m Hurdles', '4x1/4x4 Relay'],
    category: 'power-track',
  },
  'track-mid': {
    label: 'Track - Mid-Distance/Distance',
    positions: ['800m', '1500m/Mile', '5000m', '10000m', 'Steeplechase'],
    category: 'endurance',
  },
  'track-jumps': {
    label: 'Track - Jumps',
    positions: ['High Jump', 'Long Jump', 'Triple Jump', 'Pole Vault'],
    category: 'power-track',
  },
  'track-throws': {
    label: 'Track - Throws',
    positions: ['Shot Put', 'Discus', 'Javelin', 'Hammer', 'Weight Throw'],
    category: 'power-track',
  },
  'track-combined': {
    label: 'Track - Combined Events',
    positions: ['Heptathlon', 'Decathlon', 'Pentathlon'],
    category: 'power-track',
  },
  'gymnastics-w': {
    label: "Gymnastics (Women's)",
    positions: ['All-Around', 'Vault Specialist', 'Uneven Bars Specialist', 'Balance Beam Specialist', 'Floor Specialist'],
    category: 'aesthetic',
  },
  'gymnastics-m': {
    label: "Gymnastics (Men's)",
    positions: ['All-Around', 'Floor Specialist', 'Pommel Horse Specialist', 'Still Rings Specialist', 'Vault Specialist', 'Parallel Bars Specialist', 'High Bar Specialist'],
    category: 'aesthetic',
  },
  'golf': {
    label: 'Golf',
    positions: ['General (All)'],
    category: 'overhead-rotational',
  },
  'ice-hockey': {
    label: 'Ice Hockey',
    positions: ['Goalie', 'Defense', 'Left Wing', 'Center', 'Right Wing'],
    category: 'field-invasion',
  },
  'other': {
    label: 'Other (specify in notes)',
    positions: ['General'],
    category: 'other',
  },
}

export const SPORT_KEYS = Object.keys(SPORTS)
export const SPORT_OPTIONS = SPORT_KEYS.map(key => ({ value: key, label: SPORTS[key].label }))
