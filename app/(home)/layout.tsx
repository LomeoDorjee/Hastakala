import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'

import { ClerkProvider, SignedIn } from '@clerk/nextjs'
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
    //   appearance={{
    //     baseTheme: dark
    //   }
    // }
    >
    <html lang="en">
        <body className={`${inter.className}`}>
          <Topbar />
          <main className='flex flex-row'>
            <SignedIn>
              <LeftSidebar />
            </SignedIn>
            <section className='flex min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-16 max-md:pb-32 sm:px-10'>
              <div className='w-full max-w-4xl'>
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
