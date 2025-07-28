'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, languages, getTranslation, getLanguageByCode } from '@/lib/translations'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  currentLanguage: typeof languages[0]
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'al', 'it'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Default to English if no saved language or invalid
      setLanguageState('en')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params)
  }

  const currentLanguage = getLanguageByCode(language) || languages[0]

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    currentLanguage
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
} 