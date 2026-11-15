<!-- app/components/plan/overview/PlanOverviewCard.vue
     One plan in the plan overview.
     Usage: <PlanOverviewCard title="Titel" category="personal" :progress="10" is-shared /> -->
<script lang="ts">
export default defineComponent({
  props: {
    title: { type: String, required: true },
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
    // Keeps the progress between 0 and 100, so the bar never breaks
    safeProgress(): number {
      return Math.min(100, Math.max(0, this.progress));
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

    <!-- Plan name with progress -->
    <div class="flex min-w-0 flex-1 flex-col">
      <h2 class="truncate text-sm leading-4 font-semibold text-navy">{{ title }}</h2>
      <div class="flex items-center gap-2">
        <span class="w-10 shrink-0 text-sm leading-4 font-normal text-grey">{{ safeProgress }}%</span>
        <!-- role="progressbar" tells screen readers what this bar shows -->
        <div
          role="progressbar"
          :aria-valuenow="safeProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Voortgang ${title}`"
          class="h-1 w-25 rounded-full bg-sand"
        >
          <!-- Tailwind can't make a class for every percentage, so the width is set with style -->
          <div class="h-1 rounded-full bg-grey" :style="{ width: `${safeProgress}%` }" />
        </div>
      </div>
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
