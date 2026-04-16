'use client'
import { SPORTS } from '@/lib/sportsConfig'

interface Props {
  sport: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function PositionSelector({ sport, value, onChange, error }: Props) {
  const positions = sport && SPORTS[sport] ? SPORTS[sport].positions : []

  if (!sport) return null

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Position <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Select position...</option>
        {positions.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
