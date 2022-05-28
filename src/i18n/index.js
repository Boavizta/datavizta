  import { register, init, getLocaleFromNavigator } from 'svelte-i18n'

  register('en', () => import('./en.json'))
  register('fr', () => import('./fr.json'))

  let locale=getLocaleFromNavigator()

  init({
    fallbackLocale: 'fr',
    initialLocale: locale
  })


