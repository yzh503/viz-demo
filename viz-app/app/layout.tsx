
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from './Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aviation Viz',
  description: 'Aviation data analytics platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-cols-sidebar grid-rows-header h-screen">
          <Sidebar />
          <div className="col-start-2 col-end-3">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
