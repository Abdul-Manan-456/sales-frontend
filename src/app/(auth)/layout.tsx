import '../globals.css'

import { Toaster } from 'sonner'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Toaster richColors />

      <body>{children}</body>
    </html>
  )
}
