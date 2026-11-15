<!-- app/components/plans-overview/PlansOverviewSwitch.vue
     Switch between the active plans ("Overzicht") and the archived plans ("Archief").
     Usage: <PlansOverviewSwitch v-model="view" />
     `view` is "overview" or "archive". The page decides which cards to show. -->
<script lang="ts">
export default defineComponent({
  props: {
    // The current choice. With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, default: "overview" },
  },
  // Tells the parent when the user picks the other option (this makes v-model work)
  emits: ["update:modelValue"],
  data() {
    return {
      options: [
        { value: "overview", label: "Overzicht", icon: "file-lines" },
        { value: "archive", label: "Archief", icon: "archive" },
      ],
    };
  },
});
</script>

<template>
  <!-- role="group" with a label tells screen readers these two buttons belong together -->
  <div
    role="group"
    aria-label="Weergave plannen"
    class="grid grid-cols-2 rounded-xl border border-sand bg-white"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="modelValue === option.value"
      class="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-normal focus-visible:outline-2 focus-visible:outline-blue"
      :class="modelValue === option.value ? 'bg-blue text-white' : 'text-grey'"
      @click="$emit('update:modelValue', option.value)"
    >
      <IconDisplay :name="option.icon" class="size-5.5" />
      {{ option.label }}
    </button>
  </div>
</template>
