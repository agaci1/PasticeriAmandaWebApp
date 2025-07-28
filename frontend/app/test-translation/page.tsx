'use client'

import { useTranslation } from '@/contexts/TranslationContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestTranslationPage() {
  const { t, language, setLanguage, currentLanguage } = useTranslation()

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Translation Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-4">
              Current Language: <span className="font-bold">{currentLanguage.flag} {currentLanguage.nativeName}</span>
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setLanguage('en')} variant={language === 'en' ? 'default' : 'outline'}>
                🇬🇧 English
              </Button>
              <Button onClick={() => setLanguage('al')} variant={language === 'al' ? 'default' : 'outline'}>
                🇦🇱 Shqip
              </Button>
              <Button onClick={() => setLanguage('it')} variant={language === 'it' ? 'default' : 'outline'}>
                🇮🇹 Italiano
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation Translations:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Home:</strong> {t('home')}</div>
              <div><strong>About:</strong> {t('about')}</div>
              <div><strong>Menu:</strong> {t('menu')}</div>
              <div><strong>Custom Order:</strong> {t('customOrder')}</div>
              <div><strong>Cart:</strong> {t('cart')}</div>
              <div><strong>Login:</strong> {t('login')}</div>
              <div><strong>Logout:</strong> {t('logout')}</div>
              <div><strong>Review:</strong> {t('review')}</div>
              <div><strong>Find Us:</strong> {t('findUs')}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Brand Translations:</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Brand Name:</strong> {t('brandName')}</div>
              <div><strong>Brand Description:</strong> {t('brandDescription')}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Footer Translations:</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Contact Us:</strong> {t('contactUs')}</div>
              <div><strong>Located In:</strong> {t('locatedIn')}</div>
              <div><strong>Hours:</strong> {t('hours')}</div>
              <div><strong>Follow Us:</strong> {t('followUs')}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Common Translations:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Loading:</strong> {t('loading')}</div>
              <div><strong>Error:</strong> {t('error')}</div>
              <div><strong>Success:</strong> {t('success')}</div>
              <div><strong>Save:</strong> {t('save')}</div>
              <div><strong>Cancel:</strong> {t('cancel')}</div>
              <div><strong>Delete:</strong> {t('delete')}</div>
              <div><strong>Edit:</strong> {t('edit')}</div>
              <div><strong>Add:</strong> {t('add')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 