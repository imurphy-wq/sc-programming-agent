'use client'

interface MaxField {
  key: string
  label: string
  unit: string
  placeholder: string
}

const MAX_FIELDS: MaxField[] = [
  { key: 'squatMax', label: 'Back/Front Squat', unit: 'lbs', placeholder: 'e.g. 225' },
  { key: 'deadliftMax', label: 'Deadlift / Trap Bar', unit: 'lbs', placeholder: 'e.g. 275' },
  { key: 'benchMax', label: 'Bench Press', unit: 'lbs', placeholder: 'e.g. 185' },
  { key: 'cleanMax', label: 'Power Clean', unit: 'lbs', placeholder: 'e.g. 185' },
  { key: 'vertJump', label: 'Vertical Jump', unit: 'in', placeholder: 'e.g. 28' },
  { key: 'tenYardDash', label: '10-Yard Dash', unit: 'sec', placeholder: 'e.g. 1.58' },
  { key: 'pullUpMax', label: 'Pull-ups (max reps)', unit: 'reps', placeholder: 'e.g. 12' },
]

interface Props {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

export function MaxesInput({ values, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MAX_FIELDS.map(field => (
        <div key={field.key}>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {field.label}
          </label>
          <div className="flex">
            <input
              type="text"
              value={values[field.key] ?? ''}
              onChange={e => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="flex-1 border border-gray-300 rounded-l-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-2 py-1.5 text-xs text-gray-500 flex items-center">
              {field.unit}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Leave blank if untested</p>
        </div>
      ))}
    </div>
  )
}
