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
  methods: {
    // Called when the user presses "Volgende". Only the driving licence flow exists for now
    goToNextStep() {
      if (this.selectedOption === "driving-licence") {
        // navigateTo is a Nuxt function (auto-imported) that goes to another page
        navigateTo("/personal-plan-flow/get-driving-licence/choose-license-type");
      }
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Nieuw persoonlijk plan" subtitle="Welk persoonlijk plan wilt u starten?" />

    <div role="radiogroup" aria-label="Persoonlijk plan" class="flex flex-col gap-4">
      <OptionCard
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
      <PrimaryButton label="Volgende" :disabled="selectedOption === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
