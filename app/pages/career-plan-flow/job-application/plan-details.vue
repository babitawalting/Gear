<!-- app/pages/career-plan-flow/job-application/plan-details.vue
     The second screen of the job application plan ("Sollicitatie"): the user fills in the job and the end date.
     The file name is the route: this page is at /career-plan-flow/job-application/plan-details (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Plandetails" });
  },
  data() {
    return {
      // The title of the plan: the job the user applies for, for example "Software developer"
      title: "",
      // The end date (for example the closing date of the vacancy), written as "2026-11-14". Empty means no date
      endDate: "",
    };
  },
  methods: {
    // Called when the user presses "Volgende": starts a new plan with this title (0%, no evidence) and opens it.
    // The plan does not exist in a database yet, so the id "7" is a sample (startJobApplication is in app/utils)
    goToNextStep() {
      startJobApplication("7", this.title.trim());
      navigateTo("/plans/job-application/7");
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 pt-4 pb-7">
    <PageHeader title="Plandetails" subtitle="Sollicitatie" />

    <div class="flex flex-col gap-5">
      <FormField v-model="title" label="Functie" required />
      <FormField v-model="endDate" label="Einddatum" type="date" />
    </div>

    <!-- The job is required, so the button stays grey until it is filled in. mt-auto pushes it to the bottom -->
    <div class="mt-auto">
      <PrimaryButton label="Volgende" :disabled="title.trim() === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
