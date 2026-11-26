<!-- app/components/shared/ProgressBar.vue
     A progress bar with the percentage in front of it. It is used in the plan card (small) and on the plan detail screen (large).
     Both show the progress of the same plan, so the page gives both the same `progress`.
     Usage: <ProgressBar :progress="25" label="Voortgang Rijbewijs BE" />
            <ProgressBar :progress="25" size="large" label="Voortgang Rijbewijs BE" /> -->
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
    // Green when the plan is complete (100%), ochre while it is still in progress
    fillClasses(): string {
      return this.safeProgress >= 100 ? "bg-green" : "bg-ochre";
    },
  },
});
</script>

<template>
  <div class="flex items-center" :class="isLarge ? 'gap-3' : 'gap-2'">
    <!-- The small percentage has a fixed width of 34px (about as wide as "100%"), so the bar starts 42px after the start of the
         text (34px + the 8px gap), as in the design. All the bars on the plan cards start at the same place, also for "0%" or "50%" -->
    <span
      class="shrink-0 font-normal"
      :class="isLarge ? 'text-xs leading-4 text-navy' : 'w-8.5 text-sm leading-4 text-grey'"
    >{{ safeProgress }}%</span>
    <!-- role="progressbar" tells screen readers what this bar shows -->
    <div
      role="progressbar"
      :aria-valuenow="safeProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
      class="rounded-full"
      :class="isLarge ? 'h-3 flex-1 bg-white' : 'h-1 w-25 bg-sand'"
    >
      <!-- The empty part (the track) is white on the plan page, which has a coloured background. On the plan card, which is white itself,
           a white track would be invisible, so the small bar has a sand coloured track (the same colour as the border of the card).
           Tailwind can't make a class for every percentage, so the width is set with style.
           The fill is ochre while the plan is not finished and green when it is done (the percentage next to it says the same in text) -->
      <div class="h-full rounded-full" :class="fillClasses" :style="{ width: `${safeProgress}%` }" />
    </div>
  </div>
</template>
