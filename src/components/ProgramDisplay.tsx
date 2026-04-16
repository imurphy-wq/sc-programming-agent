'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
  isStreaming: boolean
}

export function ProgramDisplay({ content, isStreaming }: Props) {
  if (!content) return null

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Generated Program</h2>
        {isStreaming && (
          <span className="text-xs text-blue-600 font-medium animate-pulse">● Generating...</span>
        )}
        {!isStreaming && content && (
          <button
            onClick={() => {
              const blob = new Blob([content], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'program.md'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="text-xs text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition"
          >
            Download .md
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 overflow-x-auto">
        <div className="prose prose-sm max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-lg prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6
          prose-h3:text-base prose-h3:text-gray-800 prose-h3:mt-4
          prose-table:text-xs prose-table:w-full
          prose-th:bg-gray-100 prose-th:font-semibold prose-th:text-gray-700 prose-th:px-2 prose-th:py-1 prose-th:text-left
          prose-td:px-2 prose-td:py-1 prose-td:border-b prose-td:border-gray-100
          prose-strong:text-gray-900
          prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2
          prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-xs
          [&_pre]:bg-gray-50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-xs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        {isStreaming && (
          <div className="mt-2 h-4 w-2 bg-blue-600 rounded animate-pulse inline-block" />
        )}
      </div>
    </div>
  )
}
