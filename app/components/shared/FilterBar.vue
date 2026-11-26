<!-- app/components/shared/FilterBar.vue
     A row of filter buttons: each one has an icon with a short label under it.
     Tapping a button chooses that filter (it turns blue). Tapping it again turns the filter off.
     When there are more filters than fit on the screen, the row scrolls sideways (the user swipes to see the rest).
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
  <!-- The buttons have a fixed size with 16px (gap-4) between them.
       overflow-x-auto: when the buttons don't fit, the row scrolls sideways instead of squeezing them.
       [scrollbar-width:none] hides the scrollbar (swiping still works).
       The row is exactly as wide as the page column, so when it scrolls the buttons are cut off at the same line as the
       search field and the cards. py-1 with -my-1 only gives the focus outline room above and below -->
  <div class="-my-1 flex gap-4 overflow-x-auto py-1 [scrollbar-width:none]">
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
</template>
