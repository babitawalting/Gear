<!-- app/components/PlanCard.vue
     One plan in the "Plannen" overview. Tapping it opens the plan. -->
<script lang="ts">
export default defineComponent({
  props: {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, default: "" },
    // Percentage, 0 to 100
    progress: { type: Number, default: 0 },
  },
});
</script>

<template>
  <NuxtLink
    :to="`/plannen/${id}`"
    class="flex flex-col gap-2 rounded-xl border border-sand bg-white p-4 text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
  >
    <span class="flex items-start justify-between gap-3">
      <span class="flex flex-col">
        <span class="text-lg font-semibold">{{ title }}</span>
        <span class="text-sm">{{ type }}</span>
      </span>
      <span class="text-sm font-semibold">{{ progress }}%</span>
    </span>

    <!-- Progress bar: the screen reader reads the percentage above, so the bar itself is hidden -->
    <span class="block h-2 overflow-hidden rounded-xl border border-sand" aria-hidden="true">
      <span class="block h-full bg-blue" :style="{ width: `${progress}%` }" />
    </span>
  </NuxtLink>
</template>
