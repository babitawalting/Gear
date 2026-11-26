<!-- app/pages/shared.vue
     The file name is the route: this page is at /shared (Nuxt file-based routing).
     The overview of shared plans ("Gedeeld") from the Figma design "Gedeelde planoverzicht".
     It looks like the plans overview, but it is only for viewing: no archive, no "Nieuw plan" button.
     It shows the plans the user shared with "Plan delen" on the plan page (the saved isShared of the plan),
     plus one fixed example plan from the design ("B-Rijbewijs halen"), so the page is never empty.
     The "Gedeeld" item in BottomNav links here by itself, because this page exists. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This page shows the navigation bar at the bottom (BottomNav in the default layout)
definePageMeta({ bottomNav: true });

// One card on this page: a shared plan of the user or the example plan.
// `key` is unique for every card ("plan-7", "example-driving-licence"), so Vue can tell the cards apart
interface SharedPlanCard {
  key: string;
  title: string;
  category: string;
  // The address of the page of the plan. Empty for the example plan: it has no page, so its card is not a link
  to: string;
  progress: number;
}

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Gedeeld" });
  },
  data() {
    return {
      search: "",
      // The chosen filter: "sort" or a category (for example "career"). Empty means no filter
      filter: "",
      // "Sorteren" first (the funnel icon, the same as in the vault), then the three plan categories
      filters: [
        { value: "sort", label: "Sorteren", icon: "filter" },
        { value: "career", label: "Carrière", icon: "industry" },
        { value: "education", label: "Educatie", icon: "school" },
        { value: "personal", label: "Persoonlijk", icon: "id-card" },
      ],
      // All plans of the user. Loaded in mounted(), because the plans are saved in the browser (see app/utils/overviewPlans.ts)
      plans: [] as OverviewPlan[],
      // False until the plans are loaded, so "Geen gedeelde plannen gevonden" does not flash by before that
      hasLoadedPlans: false,
      // A fixed example from the Figma design. It only lives on this page: it is never saved and is not a plan of the user,
      // so it does not show up in the plans overview
      examplePlans: [
        { key: "example-driving-licence", title: "B-Rijbewijs halen", category: "personal", to: "", progress: 100 },
      ] as SharedPlanCard[],
    };
  },
  computed: {
    // The plans the user shared ("Plan delen" on the plan page), followed by the example plan.
    // Archived plans are left out: this page has no archive
    sharedPlans(): SharedPlanCard[] {
      const userPlans = this.plans
        .filter((plan) => plan.isShared && !plan.isArchived)
        .map((plan) => ({ key: `plan-${plan.id}`, title: plan.title, category: plan.category, to: plan.to, progress: plan.progress }));
      const cards = [...userPlans, ...this.examplePlans];
      // Every plan only once: a card whose key is already in the list is left out
      return cards.filter((card, index) => cards.findIndex((other) => other.key === card.key) === index);
    },
    // The shared plans that match the search and the chosen category.
    // Normally they keep their own order. With "Sorteren" chosen they are sorted from A to Z (the same as in the vault)
    filteredPlans(): SharedPlanCard[] {
      const searchText = this.search.trim().toLowerCase();
      const isCategory = this.filter !== "" && this.filter !== "sort";
      const plans = this.sharedPlans
        .filter((plan) => !isCategory || plan.category === this.filter)
        .filter((plan) => plan.title.toLowerCase().includes(searchText));
      if (this.filter === "sort") {
        // localeCompare compares two texts the Dutch way, so the list is in alphabetical order.
        // filter() above made a new list, so sorting it does not change sharedPlans itself
        return plans.sort((a, b) => a.title.localeCompare(b.title, "nl"));
      }
      return plans;
    },
  },
  // mounted() runs once, when the page is on the screen. Only there the browser storage with the plans can be read.
  // loadOverviewPlans is auto-imported from app/utils/overviewPlans.ts, the plans overview uses the same function
  mounted() {
    this.plans = loadOverviewPlans();
    this.hasLoadedPlans = true;
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <!-- The same spacing as the plans overview and the vault: 16px (gap-4) between every part.
         The top bar and navigation bar come from the layout -->
    <PageHeader title="Gedeeld" subtitle="Een overzicht van uw gedeelde plannen" />
    <SearchBar v-model="search" placeholder="Zoek in mijn gedeelde plannen" />
    <FilterBar v-model="filter" :filters="filters" />

    <ul v-if="filteredPlans.length > 0" class="flex flex-col gap-4">
      <li v-for="plan in filteredPlans" :key="plan.key">
        <!-- The same card as the plans overview: tapping it opens the plan (the example plan has no page, so no link).
             Every card on this page is shared, so the shared icon is always on.
             The three dots don't open a menu yet (the same as in the plans overview) -->
        <PlansOverviewCard
          :title="plan.title"
          :to="plan.to"
          :category="plan.category"
          :progress="plan.progress"
          is-shared
        />
      </li>
    </ul>
    <!-- role="status" makes screen readers announce this when nothing matches the search or filter -->
    <p v-else-if="hasLoadedPlans" role="status" class="text-sm font-normal text-grey">Geen gedeelde plannen gevonden</p>
  </div>
</template>
