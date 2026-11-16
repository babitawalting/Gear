<!-- app/pages/plans-overview.vue
     The file name is the route: this page is at /plans-overview (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Plannen" });
  },
  data() {
    return {
      // "overview" shows the active plans, "archive" shows the archived plans
      view: "overview",
      search: "",
      // True while the category sheet (the pop-up to start a new plan) is shown
      isCategorySheetOpen: false,
      // Sample data for now, this will come from the database later
      plans: [
        { id: 1, title: "Rijbewijs BE", category: "personal", progress: 0, isShared: false, isArchived: false, archivedAt: "" },
      ],
    };
  },
  computed: {
    // The plans that match the chosen view (Overzicht/Archief) and the search text
    filteredPlans() {
      const isArchive = this.view === "archive";
      const searchText = this.search.trim().toLowerCase();
      return this.plans.filter((plan) => {
        const matchesView = plan.isArchived === isArchive;
        const matchesSearch = plan.title.toLowerCase().includes(searchText);
        return matchesView && matchesSearch;
      });
    },
  },
  // mounted() runs once, when the page is on the screen. The progress of each plan is saved in the browser by the plan page,
  // so here we read it and show the same percentage on the card
  mounted() {
    for (const plan of this.plans) {
      plan.progress = percentageDone(drivingLicenceDoneSteps(loadPlanProgress(String(plan.id))));
    }
  },
  methods: {
    // Called when the user chose a category and pressed "Plan starten"
    handleStartPlan(category: string) {
      this.isCategorySheetOpen = false;
      if (category === "personal") {
        // navigateTo is a Nuxt function (auto-imported) that goes to another page
        navigateTo("/personal-plan-flow/choose-plan");
      } else if (category === "education") {
        navigateTo("/education-plan-flow/choose-plan");
      } else {
        // The flow for the career category does not exist yet
        console.log("Nieuw plan starten met categorie:", category);
      }
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 py-4">
    <!-- The top bar, the filters and the bottom tab bar are made by other team members and go here later -->
    <PageHeader title="Plannen" subtitle="Een overzicht van uw plannen" />
    <PlansOverviewSwitch v-model="view" />
    <SearchBar v-model="search" placeholder="Zoek in mijn plannen" />

    <ul v-if="filteredPlans.length > 0" class="flex flex-col gap-4">
      <li v-for="plan in filteredPlans" :key="plan.id">
        <!-- Archived plans get their own card, with the archive date instead of a progress bar -->
        <PlansOverviewArchiveCard
          v-if="plan.isArchived"
          :title="plan.title"
          :category="plan.category"
          :archived-at="plan.archivedAt"
          :is-shared="plan.isShared"
        />
        <PlansOverviewCard
          v-else
          :title="plan.title"
          :to="`/plans/${plan.id}`"
          :category="plan.category"
          :progress="plan.progress"
          :is-shared="plan.isShared"
        />
      </li>
    </ul>
    <!-- role="status" makes screen readers announce this when the list becomes empty -->
    <p v-else role="status" class="text-sm font-normal text-grey">Geen plannen gevonden</p>

    <!-- Sticks to the bottom right of the column. It opens the category sheet to start a new plan -->
    <div class="sticky bottom-6 mt-auto flex justify-end">
      <PlansOverviewAddButton label="Nieuw plan" @click="isCategorySheetOpen = true" />
    </div>

    <PlansOverviewNewPlanCategorySheet
      :open="isCategorySheetOpen"
      @close="isCategorySheetOpen = false"
      @start="handleStartPlan"
    />
  </div>
</template>
