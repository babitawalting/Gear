<!-- app/pages/personal-plan-flow/choose-plan.vue
     The screen that opens after "personal" was chosen in the category sheet.
     The file name is the route: this page is at /personal-plan-flow/choose-plan (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Nieuw persoonlijk plan" });
  },
  data() {
    return {
      // The options the user can choose from. There is only one for now
      options: [{ value: "driving-licence", title: "Rijbewijs behalen", description: "Snel onderweg!" }],
      // The chosen option. With only one option it is chosen right away
      selectedOption: "driving-licence",
    };
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Nieuw persoonlijk plan" subtitle="Welk persoonlijk plan wilt u starten?" />

    <div role="radiogroup" aria-label="Persoonlijk plan" class="flex flex-col gap-4">
      <PersonalPlanFlowOptionCard
        v-for="option in options"
        :key="option.value"
        v-model="selectedOption"
        name="option"
        :value="option.value"
        :title="option.title"
        :description="option.description"
      />
    </div>

    <!-- It does nothing yet: the next screen does not exist. mt-auto pushes it to the bottom -->
    <div class="mt-auto">
      <PersonalPlanFlowNextButton :disabled="selectedOption === ''" />
    </div>
  </div>
</template>
