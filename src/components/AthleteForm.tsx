'use client'
import { useState } from 'react'
import type { AthleteFormData } from '@/lib/types'
import { SportSelector } from './SportSelector'
import { PositionSelector } from './PositionSelector'
import { MaxesInput } from './MaxesInput'

interface Props {
  onSubmit: (data: AthleteFormData) => void
  isLoading: boolean
}

const DEFAULT_FORM: AthleteFormData = {
  outcomeDescription: '',
  sport: '',
  position: '',
  season: 'off-season',
  trainingDays: 4,
  heightFt: 5,
  heightIn: 10,
  bodyWeight: 160,
  trainingAge: '',
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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-100">
      {children}
    </div>
  )
}

export function AthleteForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<AthleteFormData>(DEFAULT_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (key: keyof AthleteFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.outcomeDescription || form.outcomeDescription.trim().length < 10) {
      newErrors.outcomeDescription = 'Please describe the outcome goal (at least 10 characters)'
    }
    if (!form.sport) newErrors.sport = 'Sport is required'
    if (!form.position) newErrors.position = 'Position is required'
    if (!form.bodyWeight || form.bodyWeight < 60) newErrors.bodyWeight = 'Enter athlete body weight'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Outcome */}
      <FormSection>
        <SectionHeader
          title="What are you trying to achieve?"
          subtitle="Describe the training goal in plain language, like you'd explain it to another coach."
        />
        <textarea
          value={form.outcomeDescription}
          onChange={e => update('outcomeDescription', e.target.value)}
          placeholder='e.g. "I need my starting middle blocker stronger through her legs and more explosive for next season — she fatigues by the third set and her blocking height drops. She has a history of right knee soreness."'
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.outcomeDescription && (
          <p className="text-red-500 text-xs mt-1">{errors.outcomeDescription}</p>
        )}
      </FormSection>

      {/* Sport + Season */}
      <FormSection>
        <SectionHeader title="Sport & Schedule" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SportSelector
            value={form.sport}
            onChange={v => { update('sport', v); update('position', '') }}
            error={errors.sport}
          />
          <PositionSelector
            sport={form.sport}
            value={form.position}
            onChange={v => update('position', v)}
            error={errors.position}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Season Phase <span className="text-red-500">*</span>
            </label>
            <select
              value={form.season}
              onChange={e => update('season', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="off-season">Off-Season</option>
              <option value="pre-season">Pre-Season</option>
              <option value="in-season">In-Season</option>
              <option value="post-season">Post-Season</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Training Days / Week <span className="text-red-500">*</span>
            </label>
            <select
              value={form.trainingDays}
              onChange={e => update('trainingDays', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      {/* Athlete Profile */}
      <FormSection>
        <SectionHeader title="Athlete Profile" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Height</label>
            <div className="flex gap-1">
              <div className="flex-1">
                <input
                  type="number"
                  value={form.heightFt}
                  onChange={e => update('heightFt', parseInt(e.target.value) || 5)}
                  min={3} max={8}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-0.5 text-center">ft</p>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={form.heightIn}
                  onChange={e => update('heightIn', parseInt(e.target.value) || 0)}
                  min={0} max={11}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-0.5 text-center">in</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Body Weight <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="number"
                value={form.bodyWeight}
                onChange={e => update('bodyWeight', parseInt(e.target.value) || 0)}
                min={60} max={500}
                className="flex-1 border border-gray-300 rounded-l-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-2 text-xs text-gray-500 flex items-center">lbs</span>
            </div>
            {errors.bodyWeight && <p className="text-red-500 text-xs mt-1">{errors.bodyWeight}</p>}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Training Age</label>
            <select
              value={form.trainingAge}
              onChange={e => update('trainingAge', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Not specified (I&apos;ll assess from context)</option>
              <option value="novice">Novice — first real program, &lt;1 year structured training</option>
              <option value="intermediate">Intermediate — 1–3 years consistent, programmatic lifting</option>
              <option value="advanced">Advanced — 3+ years, trained seriously with periodization</option>
            </select>
          </div>
        </div>
      </FormSection>

      {/* Testing Data */}
      <FormSection>
        <SectionHeader
          title="Testing Data"
          subtitle="Leave blank for any untested or unknown values. These power the % prescriptions in the program."
        />
        <MaxesInput
          values={{
            squatMax: form.squatMax,
            deadliftMax: form.deadliftMax,
            benchMax: form.benchMax,
            cleanMax: form.cleanMax,
            vertJump: form.vertJump,
            tenYardDash: form.tenYardDash,
            pullUpMax: form.pullUpMax,
          }}
          onChange={(key, value) => update(key as keyof AthleteFormData, value)}
        />
      </FormSection>

      {/* Context */}
      <FormSection>
        <SectionHeader
          title="Context & Constraints"
          subtitle="More context = better program. All fields optional."
        />
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Injury History / Current Limitations</label>
            <textarea
              value={form.injuryHistory}
              onChange={e => update('injuryHistory', e.target.value)}
              placeholder='e.g. "Right knee — patellar tendinopathy, managed. Left hamstring strain, Grade 1, healed 3 weeks ago."'
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Practice / Competition Schedule</label>
            <textarea
              value={form.practiceNotes}
              onChange={e => update('practiceNotes', e.target.value)}
              placeholder='e.g. "Practice Mon/Wed/Fri, games Sat. 2 road trips this block. Conference tournament Week 6."'
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Equipment Constraints</label>
            <input
              type="text"
              value={form.equipmentConstraints}
              onChange={e => update('equipmentConstraints', e.target.value)}
              placeholder='e.g. "No leg press. Limited trap bar — one available. No GHD."'
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Anything Else</label>
            <input
              type="text"
              value={form.additionalNotes}
              onChange={e => update('additionalNotes', e.target.value)}
              placeholder='e.g. "Athlete has buy-in issues with conditioning. Coach wants Olympic lifting emphasized."'
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </FormSection>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors duration-150 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating Program...
          </>
        ) : (
          'Generate Program'
        )}
      </button>
    </form>
  )
}
