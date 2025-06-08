import EnhancedFooter from '@/components/landing/footer/EnhancedFooter'
import NavBar from '@/components/landing/nav/NavBar'
import PricingPage from '@/components/payments/PricingPage'
import React from 'react'

export default function page() {
  return (
    <div>
      <NavBar />
      <PricingPage />
      <EnhancedFooter />
    </div>
  )
}
