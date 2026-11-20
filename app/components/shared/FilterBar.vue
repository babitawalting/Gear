<!-- app/components/shared/FilterBar.vue
     A row of filter buttons: each one has an icon with a short label under it.
     Tapping a button chooses that filter (it turns blue). Tapping it again turns the filter off.
     Usage: <FilterBar v-model="filter" :filters="[
              { value: 'sort', label: 'Sorteren', icon: 'arrow-down-short-wide' },
              { value: 'career', label: 'Carrière', icon: 'industry' },
              { value: 'education', label: 'Educatie', icon: 'school' },
              { value: 'personal', label: 'Persoonlijk', icon: 'id-card' },
            ]" /> -->
<script lang="ts">
// The shape of one filter, so TypeScript knows which fields a filter has
interface Filter {
  value: string;
  label: string;
  icon: string;
}

export default defineComponent({
  props: {
    // The chosen filter. With v-model the parent passes this in as `modelValue`. Empty means no filter is chosen
    modelValue: { type: String, default: "" },
    // The buttons to show. `label` is in Dutch, `icon` is a name from app/utils/icons.ts
    filters: { type: Array as PropType<Filter[]>, required: true },
  },
  // Tells the parent which filter was chosen (this makes v-model work)
  emits: ["update:modelValue"],
  methods: {
    isActive(filter: Filter): boolean {
      return this.modelValue === filter.value;
    },
    // Chooses the filter, or turns it off when it was already chosen
    toggle(filter: Filter) {
      const newValue = this.isActive(filter) ? "" : filter.value;
      this.$emit("update:modelValue", newValue);
    },
  },
});
</script>

<template>
  <!-- One equal column per filter, so the buttons always fill the width together -->
  <div class="grid w-full grid-flow-col auto-cols-fr gap-2">
    <!-- Not chosen: Secondary look (white, blue text). Chosen: blue with white text.
         aria-pressed tells screen readers if the filter is on -->
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      :aria-pressed="isActive(filter)"
      class="flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      :class="isActive(filter) ? 'border-blue bg-blue text-white' : 'border-sand bg-white text-blue'"
      @click="toggle(filter)"
    >
      <!-- The icon follows the text color of the button -->
      <IconDisplay :name="filter.icon" class="size-6" />
      {{ filter.label }}
    </button>
  </div>
</template>
