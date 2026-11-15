<!-- app/components/PlanHeader.vue
     Title of an application plan, with the type of plan below it and a menu button. -->
<script lang="ts">
export default defineComponent({
  props: {
    // Name of the job, for example "Software developer"
    title: { type: String, required: true },
    // Type of plan, for example "Sollicitatie"
    subtitle: { type: String, default: "" },
  },
  // The parent decides what the menu does (the menu itself is made later)
  emits: ["open-menu"],
});
</script>

<template>
  <header class="flex items-start justify-between gap-3">
    <div>
      <h1 class="text-3xl font-semibold text-navy">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm font-semibold text-navy">{{ subtitle }}</p>
    </div>
    <button
      type="button"
      class="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-xl text-navy focus-visible:outline-2 focus-visible:outline-blue"
      aria-label="Meer opties"
      @click="$emit('open-menu')"
    >
      <!-- The ellipsis icon turned upright, so the dots are under each other -->
      <AppIcon name="ellipsis" class="size-6 rotate-90" />
    </button>
  </header>
</template>
