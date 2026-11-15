<!-- app/pages/personal-plan-flow/get-driving-licence/plan-details.vue
     The third screen of the "get your driving licence" plan: the user fills in the details of the plan.
     The file name is the route: this page is at /personal-plan-flow/get-driving-licence/plan-details (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Plandetails" });
  },
  data() {
    // The previous screen sends the chosen licence in the address ("?title=Rijbewijs BE").
    // this.$route is the current address, this.$route.query holds the part after the "?"
    const titleFromAddress = this.$route.query.title;
    const licenseFromAddress = this.$route.query.license;
    return {
      // The code of the chosen licence, for example "be". It decides if there is a plan page for it
      license: typeof licenseFromAddress === "string" ? licenseFromAddress : "",
      // The title of the plan, filled in from the choice on the previous screen. The user can change it
      title: typeof titleFromAddress === "string" ? titleFromAddress : "",
      // The end date, written as "2026-11-14". Empty means no date
      endDate: "",
    };
  },
  methods: {
    // Called when the user presses "Volgende": goes to the plan page, with the title in the address.
    // The plan does not exist in a database yet, so the id "12" is a sample
    goToNextStep() {
      // Only the plan page of Rijbewijs BE exists so far. For the other licences there is no next page yet
      if (this.license !== "be") return;
      navigateTo({ path: "/plans/12", query: { title: this.title.trim() } });
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Plandetails" subtitle="Rijbewijs behalen" />

    <div class="flex flex-col gap-5">
      <FormField v-model="title" label="Titel" required />
      <FormField v-model="endDate" label="Einddatum" type="date" />
    </div>

    <!-- The title is required, so the button stays grey until it is filled in. mt-auto pushes it to the bottom -->
    <div class="mt-auto">
      <PPFNextButton :disabled="title.trim() === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
