<!-- app/pages/career-plan-flow/choose-plan.vue
     The screen that opens after "career" was chosen in the category sheet.
     The file name is the route: this page is at /career-plan-flow/choose-plan (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Nieuw carrièreplan" });
  },
  data() {
    return {
      // The options the user can choose from. There is only one for now, more career plans may come later
      options: [
        { value: "job-application", title: "Sollicitatie", description: "Zet alle documenten voor een vacature klaar" },
      ],
      // The chosen option. With only one option it is chosen right away
      selectedOption: "job-application",
    };
  },
  methods: {
    // Called when the user presses "Volgende". Only the job application plan exists, so it goes to its details
    goToNextStep() {
      // navigateTo is a Nuxt function (auto-imported) that goes to another page
      navigateTo("/career-plan-flow/job-application/plan-details");
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 pt-4 pb-7">
    <PageHeader title="Nieuw carrièreplan" subtitle="Welk carrièreplan wilt u starten?" />

    <div role="radiogroup" aria-label="Carrièreplan" class="flex flex-col gap-4">
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
