// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/a11y",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/icon/module",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils/module",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  // Settings for the <head> of every page: the website is in Dutch
  app: {
    head: {
      htmlAttrs: { lang: "nl" },
    },
  },
  fonts: {
    families: [{ name: "Public Sans", weights: [400, 600] }],
  },
  vite: {
    plugins: [tailwindcss(),
    ]
  },
});
