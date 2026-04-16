'use client'
import { useState } from 'react'
import type { AthleteFormData } from '@/lib/types'
import { AthleteForm } from '@/components/AthleteForm'
import { ProgramDisplay } from '@/components/ProgramDisplay'
import { LoadingState } from '@/components/LoadingState'

export default function Home() {
  const [program, setProgram] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const handleSubmit = async (formData: AthleteFormData) => {
    setIsLoading(true)
    setIsStreaming(false)
    setProgram('')
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || `Request failed (${response.status})`)
      }

      if (!response.body) throw new Error('No response body')

      setIsStreaming(true)
      setIsLoading(false)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setProgram(accumulated)
      }

      setIsStreaming(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">S&amp;C Programming Agent</h1>
            <span className="text-sm text-gray-500 font-medium">College Athlete Program Generator</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Describe what you want for your athlete &rarr; get a complete periodized program in your format.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form column */}
          <div>
            <AthleteForm onSubmit={handleSubmit} isLoading={isLoading || isStreaming} />
          </div>

          {/* Output column */}
          <div className="lg:sticky lg:top-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-700 text-sm font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {isLoading && !isStreaming && <LoadingState />}

            {(program || isStreaming) && (
              <ProgramDisplay content={program} isStreaming={isStreaming} />
            )}

            {!isLoading && !program && !error && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-3">🏋️</div>
                <p className="text-gray-500 text-sm">
                  Fill out the form and click <strong>Generate Program</strong> to get a complete
                  periodized training program.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Programs match your established template: 4-week blocks with Day 1–4 split, superset grouping, progressive loading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
