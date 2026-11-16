<!-- app/components/plans-overview/PlansOverviewCard.vue
     One plan in the plan overview.
     The whole card is a link to the page of the plan. The menu button on the right still works on its own.
     Usage: <PlansOverviewCard title="Titel" category="personal" :progress="10" to="/plans/12" is-shared /> -->
<script lang="ts">
export default defineComponent({
  props: {
    title: { type: String, required: true },
    // The address of the page of this plan, for example "/plans/12"
    to: { type: String, required: true },
    // "career", "education" or "personal": decides which icon is shown
    category: { type: String, default: "personal" },
    // Percentage completed, from 0 to 100
    progress: { type: Number, default: 0 },
    // True when the user shared this plan with another user
    isShared: { type: Boolean, default: false },
  },
  // Events the card sends to its parent (the plan overview)
  emits: ["open-menu"],
  computed: {
    // Icon name that belongs to the category (names from app/utils/icons.ts)
    categoryIcon(): string {
      const icons: Record<string, string> = {
        career: "industry",
        education: "school",
        personal: "id-card",
      };
      return icons[this.category] ?? "id-card";
    },
  },
});
</script>

<template>
  <!-- `relative` is needed for the link below: its ::after covers the card, so it must know where the card is -->
  <article class="relative flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2">
    <!-- Category indicator -->
    <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue">
      <IconDisplay :name="categoryIcon" class="size-5 text-white" />
    </div>

    <!-- Plan name with progress -->
    <div class="flex min-w-0 flex-1 flex-col">
      <h2 class="truncate text-sm leading-4 font-semibold text-navy">
        <!-- NuxtLink is Nuxt's link to another page of the app. Its ::after stretches over the whole card,
             so tapping anywhere on the card opens the plan. A link around the whole card would put the menu button inside a link -->
        <NuxtLink
          :to="to"
          class="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue"
        >{{ title }}</NuxtLink>
      </h2>
      <!-- The shared progress bar, the same one as on the plan detail screen -->
      <PlansOverviewProgressBar :progress="progress" :label="`Voortgang ${title}`" />
    </div>

    <!-- Shared indicator: the icon is decorative, so the text is for screen readers -->
    <div v-if="isShared" class="shrink-0">
      <IconDisplay name="people-arrows" class="size-6 text-blue" />
      <span class="sr-only">Gedeeld met een andere gebruiker</span>
    </div>

    <!-- Menu button. The negative margins keep the 44px touch target inside the 52px card.
         `relative` puts it above the stretched link, so it can be tapped without opening the plan -->
    <button
      type="button"
      aria-label="Meer opties"
      class="relative -my-1 -mr-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-grey focus-visible:outline-2 focus-visible:outline-blue"
      @click="$emit('open-menu')"
    >
      <IconDisplay name="ellipsis" class="size-5 rotate-90" />
    </button>
  </article>
</template>
