'use client'
import { SPORT_OPTIONS } from '@/lib/sportsConfig'

interface Props {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function SportSelector({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Sport <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Select sport...</option>
        {SPORT_OPTIONS.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
