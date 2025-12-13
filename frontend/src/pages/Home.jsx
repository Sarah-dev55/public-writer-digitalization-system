import React from 'react'
import { AboutUsSection } from './Home/sections/AboutUsSection'
import { ClientReviewsSection } from './Home/sections/ClientReviewsSection'
import Footer from '../components/layout/Footer'
import { HeaderSection } from './Home/sections/HeaderSection'
import { HeroSection } from './Home/sections/HeroSection'
import { HowItWorksSection } from './Home/sections/HowItWorksSection'
import { StatsSection } from './Home/sections/StatsSection'
import { AuthProvider } from '../context/AuthContext'

export default function Home(){
  return (
    <AuthProvider>
      <main className="flex flex-col w-full">
        <HeaderSection />
        <StatsSection />
        <AboutUsSection />
        <HeroSection />
        <ClientReviewsSection />
        <HowItWorksSection />
        <Footer />
      </main>
    </AuthProvider>
  )
}
