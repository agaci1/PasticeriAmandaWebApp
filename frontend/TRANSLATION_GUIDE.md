# Translation System Guide

## Overview

The Pasticeri Amanda web app now supports multiple languages: English (🇬🇧), Albanian (🇦🇱), and Italian (🇮🇹). The translation system is built using React Context and provides a seamless user experience with persistent language preferences.

## Features

- **Three Languages**: English, Albanian, and Italian with native names and flag emojis
- **Persistent Storage**: Language preference is saved in localStorage
- **Responsive Design**: Language selector adapts to mobile and desktop layouts
- **Comprehensive Coverage**: All navigation, footer, and common UI elements are translated
- **Easy to Extend**: Simple to add new languages or translation keys

## Implementation Details

### 1. Translation Files

**Location**: `frontend/lib/translations.ts`

This file contains:
- Language definitions with flags and native names
- Translation objects for each language
- Helper functions for translation lookup

### 2. Translation Context

**Location**: `frontend/contexts/TranslationContext.tsx`

Provides:
- `language`: Current language code
- `setLanguage()`: Function to change language
- `t()`: Translation function
- `currentLanguage`: Current language object with metadata

### 3. Language Selector Component

**Location**: `frontend/components/LanguageSelector.tsx`

Features:
- Dropdown menu with flag icons
- Native language names
- Mobile-optimized variant
- Automatic language switching

### 4. Integration Points

#### Header Integration
- Language selector positioned in the top navigation
- All navigation links use translations
- Brand name and description are translated

#### Mobile Menu Integration
- Language selector appears at the top of mobile menu
- All mobile navigation items are translated

#### Footer Integration
- Contact information and descriptions are translated
- Brand name and description are translated

## Usage

### Basic Translation Usage

```tsx
import { useTranslation } from '@/contexts/TranslationContext'

function MyComponent() {
  const { t } = useTranslation()
  
  return <h1>{t('home')}</h1>
}
```

### Language Switching

```tsx
import { useTranslation } from '@/contexts/TranslationContext'

function LanguageSwitcher() {
  const { setLanguage, currentLanguage } = useTranslation()
  
  return (
    <button onClick={() => setLanguage('al')}>
      {currentLanguage.flag} {currentLanguage.nativeName}
    </button>
  )
}
```

### Adding New Translations

1. **Add new keys to all language objects** in `frontend/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    // ... existing translations
    newKey: 'English text',
  },
  al: {
    // ... existing translations
    newKey: 'Albanian text',
  },
  it: {
    // ... existing translations
    newKey: 'Italian text',
  }
}
```

2. **Use the translation in your component**:

```tsx
const { t } = useTranslation()
return <p>{t('newKey')}</p>
```

### Adding a New Language

1. **Add language definition** in `frontend/lib/translations.ts`:

```typescript
export const languages: LanguageOption[] = [
  // ... existing languages
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    nativeName: 'Français'
  }
]
```

2. **Add translations object**:

```typescript
export const translations = {
  // ... existing languages
  fr: {
    home: 'Accueil',
    about: 'À propos',
    // ... add all translation keys
  }
}
```

3. **Update the Language type**:

```typescript
export type Language = 'en' | 'al' | 'it' | 'fr'
```

## Translation Keys

### Navigation
- `home` - Home page
- `about` - About page
- `menu` - Menu page
- `customOrder` - Custom order page
- `cart` - Shopping cart
- `purchaseHistory` - Order history
- `login` - Login button
- `logout` - Logout button
- `review` - Review link
- `findUs` - Find us link

### Admin Navigation
- `dashboard` - Admin dashboard
- `newOrders` - New orders
- `pendingOrders` - Pending orders
- `completedOrders` - Completed orders
- `canceledOrders` - Canceled orders
- `manageCakes` - Manage cakes
- `manageSweets` - Manage sweets
- `manageOther` - Manage other items
- `manageFeed` - Manage feed

### Brand
- `brandName` - Amanda Pastry Shop
- `brandDescription` - Brand description

### Footer
- `contactUs` - Contact us section
- `locatedIn` - Location description
- `hours` - Opening hours
- `followUs` - Social media section

### Common
- `loading` - Loading text
- `error` - Error text
- `success` - Success text
- `save` - Save button
- `cancel` - Cancel button
- `delete` - Delete button
- `edit` - Edit button
- `add` - Add button
- `submit` - Submit button
- `close` - Close button

### Language
- `language` - Language label
- `selectLanguage` - Select language prompt

## Testing

Visit `/test-translation` to see all translations in action and test language switching functionality.

## Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Keep translations consistent** across similar UI elements
3. **Use descriptive keys** that clearly indicate the content
4. **Test all languages** when adding new features
5. **Consider text length** - some languages may be longer than others

## Browser Support

The translation system works in all modern browsers that support:
- React Context API
- localStorage
- ES6+ features

## Performance

- Translations are loaded once and cached in context
- Language switching is instant
- No additional network requests for translations
- Minimal bundle size impact 