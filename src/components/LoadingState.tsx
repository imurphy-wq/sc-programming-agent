export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="flex gap-1 mb-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-sm font-medium">Generating program...</p>
      <p className="text-xs text-gray-400 mt-1">This takes 20–40 seconds. Content will appear as it generates.</p>
    </div>
  )
}
