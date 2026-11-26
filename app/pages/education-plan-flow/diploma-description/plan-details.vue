<!-- app/pages/education-plan-flow/diploma-description/plan-details.vue
     The second screen of the "diploma description" plan: the user fills in the details of the plan.
     The file name is the route: this page is at /education-plan-flow/diploma-description/plan-details (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Plandetails" });
  },
  data() {
    // The previous screen sends the title in the address ("?title=HBO-bachelor beschrijving").
    // this.$route.query holds the part after the "?"
    const titleFromAddress = this.$route.query.title;
    const diplomaFromAddress = this.$route.query.diploma;
    return {
      // The chosen diploma, for example "HBO-bachelor". The plan page needs it for its texts
      diploma: typeof diplomaFromAddress === "string" ? diplomaFromAddress : "",
      // The title of the plan, filled in from the chosen diploma. The user can change it
      title: typeof titleFromAddress === "string" ? titleFromAddress : "",
      // The end date, written as "2026-11-14". Empty means no date
      endDate: "",
    };
  },
  methods: {
    // Called when the user presses "Volgende": starts a new plan with this title (0%, no evidence) and opens it.
    // The plan does not exist in a database yet, so the id "5" is a sample (startDiplomaDescription is in app/utils)
    goToNextStep() {
      startDiplomaDescription("5", this.title.trim(), this.diploma);
      navigateTo("/plans/diploma-description/5");
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 pt-4 pb-7">
    <PageHeader title="Plandetails" subtitle="Diplomabeschrijving aanvragen" />

    <div class="flex flex-col gap-5">
      <FormField v-model="title" label="Titel" required />
      <FormField v-model="endDate" label="Einddatum" type="date" />
    </div>

    <!-- The title is required, so the button stays grey until it is filled in. mt-auto pushes it to the bottom -->
    <div class="mt-auto">
      <PrimaryButton label="Volgende" :disabled="title.trim() === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
