<!-- app/components/plans-overview/PlansOverviewProgressBar.vue
     A progress bar with the percentage in front of it, used in the plan card of the overview.
     The plan detail screen has its own copy (PPFProgressBar), so a change here does not change that screen.
     Usage: <PlansOverviewProgressBar :progress="25" label="Voortgang Rijbewijs BE" />
            <PlansOverviewProgressBar :progress="25" size="large" label="Voortgang Rijbewijs BE" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // Percentage completed, from 0 to 100
    progress: { type: Number, default: 0 },
    // "small" (4px high bar of 100px, for the plan card) or "large" (12px high bar that fills the width)
    size: { type: String, default: "small" },
    // The text for screen readers, in Dutch, for example "Voortgang Rijbewijs BE"
    label: { type: String, default: "Voortgang" },
  },
  computed: {
    // Keeps the progress between 0 and 100, so the bar never breaks
    safeProgress(): number {
      return Math.min(100, Math.max(0, this.progress));
    },
    isLarge(): boolean {
      return this.size === "large";
    },
  },
});
</script>

<template>
  <div class="flex items-center" :class="isLarge ? 'gap-3' : 'gap-2'">
    <span
      class="shrink-0 font-normal"
      :class="isLarge ? 'text-xs leading-4 text-navy' : 'w-10 text-sm leading-4 text-grey'"
    >{{ safeProgress }}%</span>
    <!-- role="progressbar" tells screen readers what this bar shows -->
    <div
      role="progressbar"
      :aria-valuenow="safeProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
      class="rounded-full bg-sand"
      :class="isLarge ? 'h-3 flex-1' : 'h-1 w-25'"
    >
      <!-- Tailwind can't make a class for every percentage, so the width is set with style. The fill is grey for now -->
      <div class="h-full rounded-full bg-grey" :style="{ width: `${safeProgress}%` }" />
    </div>
  </div>
</template>
