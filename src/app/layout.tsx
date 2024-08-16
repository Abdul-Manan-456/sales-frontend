'use client'
import './globals.css'

import { RecoilRoot } from 'recoil'
import { Toaster } from 'sonner'

import ProtectedRoute from '@/components/protected-route'
import { Toaster as ChadToaster } from '@/components/ui/toaster'
import StoreProvider from '@/lib/redux/StoreProvider'

import Navbar from '../components/Navbar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`inter.className flex md:flex-row flex-col`}>
          <RecoilRoot>
            <ProtectedRoute>
              <Navbar />
              <div className="w-full sm:ml-14">
                {children}
                <Toaster richColors />
                <ChadToaster />
              </div>
            </ProtectedRoute>
          </RecoilRoot>
        </body>
      </StoreProvider>
    </html>
  )
}
