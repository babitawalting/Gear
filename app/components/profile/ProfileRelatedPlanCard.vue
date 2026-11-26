<!-- app/components/profile/ProfileRelatedPlanCard.vue
     The plan a message is about, on the message screen ("Gerelateerd plan"): an icon, the plan name, its progress and an arrow.
     For now it only looks like the Figma design: it is not linked to a real plan yet, so it is not a link.
     Usage: <ProfileRelatedPlanCard title="Software developer" icon="industry" :progress="100" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    title: { type: String, required: true },
    // Name of the icon in the blue square, see app/utils/icons.ts
    icon: { type: String, required: true },
    // Percentage completed, from 0 to 100
    progress: { type: Number, default: 0 },
  },
});
</script>

<template>
  <div class="flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2 pr-4">
    <!-- Blue square with a white category icon (the same look as in PlansOverviewCard) -->
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue text-white">
      <IconDisplay :name="icon" class="size-5" />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <h3 class="truncate text-base leading-5 font-semibold text-navy">{{ title }}</h3>
      <!-- The shared progress bar, the same one as in the plan overview (green at 100%) -->
      <ProgressBar :progress="progress" :label="`Voortgang ${title}`" />
    </div>

    <IconDisplay name="arrow-right" class="size-6 shrink-0 text-blue" />
  </div>
</template>
