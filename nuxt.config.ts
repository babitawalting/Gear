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
  // Components in app/components/shared keep their short name: <SearchBar />, not <SharedSearchBar />
  components: [
    { path: "~/components/shared", pathPrefix: false },
    // Components in personal-plan-flow start with PPF (short for personal plan flow): <PPFStepCard />, not <PersonalPlanFlowPPFStepCard />
    { path: "~/components/personal-plan-flow", pathPrefix: false },
    // Same for education-plan-flow, with EPF (short for education plan flow): <EPFOptionCard />
    { path: "~/components/education-plan-flow", pathPrefix: false },
    // The category sheet components keep a short name: <PlanCategorySheet />, not <PlansOverviewNewPlanCategorySheet />
    { path: "~/components/plans-overview/new-plan", pathPrefix: false },
    "~/components",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  fonts: {
    families: [{ name: "Public Sans", weights: [400, 600] }],
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss(),
    ]
  },
});
