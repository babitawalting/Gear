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
      // Sample data for now, this will come from the database later
      plans: [
        { id: 1, title: "Rijbewijs BE", category: "personal", to: "/plans/1", progress: 0, isShared: false, isArchived: false, archivedAt: "" },
        { id: 7, title: "Software developer", category: "career", to: "/plans/job-application/7", progress: 0, isShared: false, isArchived: false, archivedAt: "" },
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
      if (plan.category === "career") {
        // A job application plan ("Sollicitatie") has its own saved progress, see app/utils/jobApplicationProgress.ts
        const progress = loadJobApplicationProgress(String(plan.id));
        // The title can be changed on the plan page (the three dots), so the card reads it from the saved progress
        plan.title = jobApplicationTitle(progress);
        plan.progress = Math.round(percentageDone(jobApplicationDoneSteps(progress)));
        plan.isShared = progress.isShared;
        plan.isArchived = progress.archivedAt !== "";
        plan.archivedAt = progress.archivedAt;
      } else {
        const progress = loadPlanProgress(String(plan.id));
        // The title can be changed on the plan page (the three dots), so the card reads it from the saved progress
        plan.title = drivingLicenceTitle(progress);
        plan.progress = percentageDone(drivingLicenceDoneSteps(progress));
      }
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
    <p v-else role="status" class="text-sm font-normal text-grey">Geen plannen gevonden</p>

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
