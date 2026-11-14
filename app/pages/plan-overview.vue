<!-- app/pages/plan-overview.vue
     The file name is the route: this page is at /plan-overview (Nuxt file-based routing). -->
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
        { id: 1, title: "Titel", category: "personal", progress: 10, isShared: false, isArchived: false, archivedAt: "" },
        { id: 2, title: "EHBO diploma", category: "career", progress: 100, isShared: false, isArchived: true, archivedAt: "2026-11-14" },
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
  methods: {
    // Called when the user chose a category and pressed "Plan starten".
    // The next step of the new plan flow does not exist yet, so for now the sheet just closes
    handleStartPlan(category: string) {
      console.log("Nieuw plan starten met categorie:", category);
      this.isCategorySheetOpen = false;
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 py-4">
    <!-- The top bar, the filters and the bottom tab bar are made by other team members and go here later -->
    <PageHeader title="Plannen" subtitle="Een overzicht van uw plannen" />
    <PlanOverviewSwitch v-model="view" />
    <SearchBar v-model="search" placeholder="Zoek in mijn plannen" />

    <ul v-if="filteredPlans.length > 0" class="flex flex-col gap-4">
      <li v-for="plan in filteredPlans" :key="plan.id">
        <!-- Archived plans get their own card, with the archive date instead of a progress bar -->
        <PlanOverviewArchiveCard
          v-if="plan.isArchived"
          :title="plan.title"
          :category="plan.category"
          :archived-at="plan.archivedAt"
          :is-shared="plan.isShared"
        />
        <PlanOverviewCard
          v-else
          :title="plan.title"
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
      <AddButton label="Nieuw plan" @click="isCategorySheetOpen = true" />
    </div>

    <PlanOverviewCategorySheet
      :open="isCategorySheetOpen"
      @close="isCategorySheetOpen = false"
      @start="handleStartPlan"
    />
  </div>
</template>
