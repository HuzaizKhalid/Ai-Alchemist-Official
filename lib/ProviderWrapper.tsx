'use client'
import { SearchProvider } from '@/context/searchContext'
import React from 'react'

const ProviderWrapper = ({ children }:{ children: React.ReactNode }) => {
  return (
    <SearchProvider>
        {/* This is where you can wrap your components with the SearchProvider */}
        {children}
    </SearchProvider>
  )
}

export default ProviderWrapper