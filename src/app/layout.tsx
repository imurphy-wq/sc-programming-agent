import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'S&C Programming Agent',
  description: 'AI-powered strength and conditioning program generator for college athletes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
