import Navbar from '@/components/nav/Navbar'
import HeroSection from '@/components/hero/HeroSection'
import HowItWorks from '@/components/sections/HowItWorks'
import ProblemScale from '@/components/sections/ProblemScale'
import WhatAgentFinds from '@/components/sections/WhatAgentFinds'
import AutonomousFeatures from '@/components/sections/AutonomousFeatures'
import EntitlementGapDashboard from '@/components/sections/EntitlementGapDashboard'
import ProofOfEntitlement from '@/components/sections/ProofOfEntitlement'
import CTABanner from '@/components/sections/CTABanner'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <EntitlementGapDashboard />
      <ProofOfEntitlement />
      <HowItWorks />
      <ProblemScale />
      <WhatAgentFinds />
      <AutonomousFeatures />
      <CTABanner />
      <Footer />
    </main>
  )
}

