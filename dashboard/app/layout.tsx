import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ND-Bot Dashboard',
  description: 'Dashboard per gestione bot Discord',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>
        <div className="flex min-h-screen bg-gray-900 text-white">
          <aside className="w-64 bg-gray-800 p-6 shadow-lg">
            <h1 className="text-2xl font-bold mb-8 text-blue-400">ND-Bot Dashboard</h1>
            <nav className="space-y-2">
              <Link href="/" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
                🏠 Home
              </Link>
              <Link href="/tickets" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
                🎫 Ticket
              </Link>
              <Link href="/logs" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
                📄 Logs
              </Link>
              <Link href="/warnings" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
                ⚠️ Avvisi
              </Link>
              <Link href="/feedback" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
                💬 Feedback
              </Link>
            </nav>
            <div className="mt-8 p-4 bg-gray-700 rounded">
              <p className="text-sm text-gray-300">ND-Bot v1.0.0</p>
              <p className="text-xs text-gray-400 mt-1">by NeonDevs</p>
            </div>
          </aside>
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}