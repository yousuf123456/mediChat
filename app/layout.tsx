"use client";

import { ActiveStatus } from './context/ActiveStatus';
import { SessionContext } from './context/SessionContext'
import { ToasterContext } from './context/ToasterContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MediChat',
  description: 'MediChat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className=''>
      <body className="h-screen">
        <SessionContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </SessionContext>
      </body>
    </html>
  )
}
