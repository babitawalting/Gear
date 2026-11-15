<!-- app/components/plans-overview/PlansOverviewArchiveCard.vue
     One archived plan in the plan overview (the "Archief" view).
     It looks like PlansOverviewCard, but shows the archive date instead of a progress bar.
     Usage: <PlansOverviewArchiveCard title="Titel" category="career" archived-at="2026-01-01" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    title: { type: String, required: true },
    // "career", "education" or "personal": decides which icon is shown
    category: { type: String, default: "personal" },
    // The date the plan was archived, written as "2026-11-14" (year-month-day)
    archivedAt: { type: String, required: true },
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
    // Turns "2026-11-14" into "14/11/2026" (dd/mm/yyyy)
    formattedDate(): string {
      const [year, month, day] = this.archivedAt.split("-");
      return `${day}/${month}/${year}`;
    },
  },
});
</script>

<template>
  <article class="flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2">
    <!-- Category indicator -->
    <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue">
      <IconDisplay :name="categoryIcon" class="size-5 text-white" />
    </div>

    <!-- Plan name with the date it was archived -->
    <div class="flex min-w-0 flex-1 flex-col">
      <h2 class="truncate text-sm leading-4 font-semibold text-navy">{{ title }}</h2>
      <p class="truncate text-sm leading-4 font-normal text-grey">
        <!-- Hidden text: screen readers say what the date means, the screen only shows the date -->
        <span class="sr-only">Gearchiveerd op</span>
        <!-- <time> with a datetime attribute lets browsers and screen readers read the date correctly -->
        <time :datetime="archivedAt">{{ formattedDate }}</time>
      </p>
    </div>

    <!-- Shared indicator: the icon is decorative, so the text is for screen readers -->
    <div v-if="isShared" class="shrink-0">
      <IconDisplay name="people-arrows" class="size-6 text-blue" />
      <span class="sr-only">Gedeeld met een andere gebruiker</span>
    </div>

    <!-- Menu button. The negative margins keep the 44px touch target inside the 52px card -->
    <button
      type="button"
      aria-label="Meer opties"
      class="-my-1 -mr-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-grey focus-visible:outline-2 focus-visible:outline-blue"
      @click="$emit('open-menu')"
    >
      <IconDisplay name="ellipsis" class="size-5 rotate-90" />
    </button>
  </article>
</template>
