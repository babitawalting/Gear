// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/a11y', '@nuxt/content', '@nuxt/eslint', '@nuxt/fonts', '@nuxt/hints', '@nuxt/icon/module', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils/module'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
