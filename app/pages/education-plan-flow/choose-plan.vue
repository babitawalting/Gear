<!-- app/pages/education-plan-flow/choose-plan.vue
     The screen that opens after "education" was chosen in the category sheet.
     The file name is the route: this page is at /education-plan-flow/choose-plan (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Nieuw educatieplan" });
  },
  data() {
    return {
      // The options the user can choose from. There is only a placeholder for now, the real education plans come later
      options: [{ value: "placeholder", title: "PLACEHOLDER", description: "PLACEHOLDER" }],
      // The chosen option. With only one option it is chosen right away
      selectedOption: "placeholder",
    };
  },
  methods: {
    // Called when the user presses "Volgende". Only the "start a degree" flow exists for now
    goToNextStep() {
      // navigateTo is a Nuxt function (auto-imported) that goes to another page
      navigateTo("/education-plan-flow/start-degree/choose-degree-type");
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Nieuw educatieplan" subtitle="Welk educatieplan wilt u starten?" />

    <div role="radiogroup" aria-label="Educatieplan" class="flex flex-col gap-4">
      <!-- PPFOptionCard and PPFNextButton are made for the personal plan flow, but are reused here -->
      <PPFOptionCard
        v-for="option in options"
        :key="option.value"
        v-model="selectedOption"
        name="option"
        :value="option.value"
        :title="option.title"
        :description="option.description"
      />
    </div>

    <!-- mt-auto pushes the button to the bottom of the screen -->
    <div class="mt-auto">
      <PPFNextButton :disabled="selectedOption === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
