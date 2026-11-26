<!-- app/pages/plans-overview.vue
     The file name is the route: this page is at /plans-overview (Nuxt file-based routing). -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This page shows the navigation bar at the bottom (BottomNav in the default layout).
definePageMeta({ bottomNav: true });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Plannen" });
  },
  data() {
    return {
      // "overview" shows the active plans, "archive" shows the archived plans
      view: "overview",
      // The two options of the switch: the value, the text and the icon of each
      viewOptions: [
        { value: "overview", label: "Overzicht", icon: "file-lines" },
        { value: "archive", label: "Archief", icon: "archive" },
      ],
      search: "",
      // True while the category sheet (the pop-up to start a new plan) is shown
      isCategorySheetOpen: false,
      // All plans of the user. Loaded in mounted(), because the plans are saved in the browser (see app/utils/overviewPlans.ts)
      plans: [] as OverviewPlan[],
      // False until the plans are loaded, so "Geen plannen gevonden" does not flash by before that
      hasLoadedPlans: false,
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
    // /plans-overview?view=archive opens the "Archief" tab (the plan page does this after "Plan archiveren").
    // $route.query holds the part of the address after the "?"
    if (this.$route.query.view === "archive") {
      this.view = "archive";
    }
    // loadOverviewPlans is auto-imported from app/utils/overviewPlans.ts. The shared plans overview (/shared) uses it too
    this.plans = loadOverviewPlans();
    this.hasLoadedPlans = true;
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
      } else if (category === "career") {
        navigateTo("/career-plan-flow/choose-plan");
      }
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <!-- The filters are made by other team members and go here later. The top bar and navigation bar come from the layout -->
    <PageHeader title="Plannen" subtitle="Een overzicht van uw plannen" />
    <ArchiveSwitch v-model="view" :options="viewOptions" label="Weergave plannen" />
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
          :to="plan.to"
          :category="plan.category"
          :progress="plan.progress"
          :is-shared="plan.isShared"
        />
      </li>
    </ul>
    <!-- role="status" makes screen readers announce this when the list becomes empty -->
    <p v-else-if="hasLoadedPlans" role="status" class="text-sm font-normal text-grey">Geen plannen gevonden</p>

    <!-- Sticks to the bottom right of the column, 24px above the navigation bar (--bottom-nav-space is set in the layout).
         It opens the category sheet to start a new plan -->
    <div class="sticky bottom-[calc(var(--bottom-nav-space)+24px)] mt-auto flex justify-end">
      <AddButton label="Nieuw plan" @click="isCategorySheetOpen = true" />
    </div>

    <PlanCategorySheet
      :open="isCategorySheetOpen"
      @close="isCategorySheetOpen = false"
      @start="handleStartPlan"
    />
  </div>
</template>
