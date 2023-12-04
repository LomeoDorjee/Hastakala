import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'

import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Providers } from '@/providers/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hastakala',
  description: 'Association for Craft Producers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
    <html lang="en">
        <body className={`${inter.className}`}>
          <Topbar />
          <main className='flex flex-row'>
            <SignedIn>
              <LeftSidebar />
            </SignedIn>
            <SignedOut>
              <div className="w-[50px] flex max-md:w-[15px]"></div>
            </SignedOut>
            <section className='flex min-h-screen flex-1 flex-col items-center px-5 pb-10 pt-4 max-md:pb-32 sm:px-6 max-md:pt-16'>
              <div className='w-full'>
                <Providers>
                  {children}
                  <Toaster position='bottom-center'/>
                </Providers>
              </div>
            </section>
            {/* <RightSidebar /> */}
          </main>
          <SignedIn>
            <Bottombar />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
