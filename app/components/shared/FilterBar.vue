<!-- app/components/shared/FilterBar.vue
     A row of filter buttons: each one has an icon with a short label under it.
     Tapping a button chooses that filter (it turns blue). Tapping it again turns the filter off.
     When there are more filters than fit on the screen, the row scrolls sideways (the user swipes to see the rest).
     With `sort-options` the row starts with a "Sorteren" button that opens a small menu (FilterSortMenu).
     Sorting and filtering are separate, so the user can choose a category and an order at the same time.
     Usage: <FilterBar v-model="filter" v-model:sort="sort" :sort-options="sortOptions" :filters="[
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
    // The buttons to show. `label` is in Dutch, `icon` is a name from app/utils/icons.ts. Can be empty (only "Sorteren")
    filters: { type: Array as PropType<Filter[]>, default: () => [] },
    // The chosen sort option, for example "newest". With v-model:sort the parent passes this in
    sort: { type: String, default: "" },
    // The choices of the "Sorteren" menu (from app/utils/sortOptions.ts). Empty means no "Sorteren" button
    sortOptions: { type: Array as PropType<SortOption[]>, default: () => [] },
  },
  // Tells the parent which filter was chosen (v-model) and which sort option (v-model:sort)
  emits: ["update:modelValue", "update:sort"],
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
  <!-- relative: the sort menu is placed against this outer element, so the scrolling row does not cut it off -->
  <div class="relative">
    <!-- The buttons have a fixed size with 16px (gap-4) between them.
         overflow-x-auto: when the buttons don't fit, the row scrolls sideways instead of squeezing them.
         [scrollbar-width:none] hides the scrollbar (swiping still works).
         The row is exactly as wide as the page column, so when it scrolls the buttons are cut off at the same line as the
         search field and the cards. py-1 with -my-1 only gives the focus outline room above and below -->
    <div class="-my-1 flex gap-4 overflow-x-auto py-1 [scrollbar-width:none]">
      <!-- "Sorteren" is always the first button. It forwards the chosen option to the page (v-model:sort) -->
      <FilterSortMenu
        v-if="sortOptions.length > 0"
        :model-value="sort"
        :options="sortOptions"
        @update:model-value="$emit('update:sort', $event)"
      />
      <!-- Not chosen: Secondary look (white, blue text). Chosen: blue with white text.
           aria-pressed tells screen readers if the filter is on.
           The focus outline sits inside the button (-outline-offset-4), so the edge of the row never cuts it off.
           On a chosen (blue) button the outline is white, so it stays visible -->
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :aria-pressed="isActive(filter)"
        class="flex h-16 w-[67px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border text-[10px] leading-3 font-semibold focus-visible:outline-2 focus-visible:-outline-offset-4"
        :class="isActive(filter) ? 'border-blue bg-blue text-white focus-visible:outline-white' : 'border-sand bg-white text-blue focus-visible:outline-blue'"
        @click="toggle(filter)"
      >
        <!-- The icon follows the color of the button: blue, or white when chosen -->
        <IconDisplay :name="filter.icon" class="size-6" />
        <!-- The label is navy (the "black" of our colors), or white when chosen so it stays readable on blue -->
        <span :class="isActive(filter) ? 'text-white' : 'text-navy'">{{ filter.label }}</span>
      </button>
    </div>
  </div>
</template>
