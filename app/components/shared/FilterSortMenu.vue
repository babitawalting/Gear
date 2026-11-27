<!-- app/components/shared/FilterSortMenu.vue
     The "Sorteren" button of the FilterBar, with the small menu that opens under it.
     The button has the same look as the other filter buttons. Tapping it opens a small white card with the sort choices
     (for example "Nieuwste eerst" or "Naam (A-Z)"). The chosen one is blue with a check in front.
     Choosing an option, tapping outside the menu or pressing Escape closes it.
     The FilterBar adds this component by itself when a page gives it sort options, pages don't use it directly.
     Usage (inside FilterBar): <FilterSortMenu v-model="sort" :options="sortOptions" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The chosen sort option, for example "newest". With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, required: true },
    // The choices in the menu (from app/utils/sortOptions.ts). The first one is the normal order of the page
    options: { type: Array as PropType<SortOption[]>, required: true },
  },
  // Tells the parent which option was chosen (this makes v-model work)
  emits: ["update:modelValue"],
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    // The button is blue while the menu is open, or when the user chose another order than the normal one.
    // That way the user can see that the list is sorted differently
    isActive(): boolean {
      return this.isMenuOpen || this.modelValue !== this.options[0]?.value;
    },
  },
  // mounted() runs once, when the component is on the page. From then on we listen to taps and keys on the whole page,
  // so a tap outside the menu or the Escape key can close it
  mounted() {
    document.addEventListener("click", this.handlePageClick);
    document.addEventListener("keydown", this.handleKeydown);
  },
  // beforeUnmount() runs when the component leaves the page: stop listening, otherwise the listeners stay behind
  beforeUnmount() {
    document.removeEventListener("click", this.handlePageClick);
    document.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    choose(option: SortOption) {
      this.$emit("update:modelValue", option.value);
      this.closeMenu();
    },
    // Closes the menu and puts the keyboard focus back on the "Sorteren" button, so keyboard users don't get lost
    closeMenu() {
      this.isMenuOpen = false;
      (this.$refs.button as HTMLButtonElement).focus();
    },
    // A tap somewhere on the page: when it was not inside this component (button or menu), the menu closes.
    // $el is the outer element of this component
    handlePageClick(event: MouseEvent) {
      if (this.isMenuOpen && !this.$el.contains(event.target as Node)) {
        this.isMenuOpen = false;
      }
    },
    handleKeydown(event: KeyboardEvent) {
      if (this.isMenuOpen && event.key === "Escape") {
        this.closeMenu();
      }
    },
  },
});
</script>

<template>
  <!-- No `relative` here on purpose: the FilterBar row scrolls sideways and would cut off the menu.
       The menu is placed against the FilterBar itself (it has `relative`), so it can hang below the row -->
  <div class="shrink-0">
    <!-- The same size and look as the other filter buttons in the FilterBar.
         aria-expanded tells screen readers if the menu is open, aria-controls which element is the menu -->
    <button
      ref="button"
      type="button"
      :aria-expanded="isMenuOpen"
      aria-controls="filter-sort-menu"
      class="flex h-16 w-[67px] flex-col items-center justify-center gap-1 rounded-xl border text-[10px] leading-3 font-semibold focus-visible:outline-2 focus-visible:-outline-offset-4"
      :class="isActive ? 'border-blue bg-blue text-white focus-visible:outline-white' : 'border-sand bg-white text-blue focus-visible:outline-blue'"
      @click="toggleMenu"
    >
      <IconDisplay name="arrow-down-short-wide" class="size-6" />
      <span :class="isActive ? 'text-white' : 'text-navy'">Sorteren</span>
    </button>

    <!-- The menu: a white card with a sand border and the same soft shadow as the navigation bar.
         top-full + mt-2: 8px under the filter row. z-30: in front of the cards, behind the navigation bar and pop-ups -->
    <div
      v-if="isMenuOpen"
      id="filter-sort-menu"
      class="absolute top-full left-0 z-30 mt-2 flex w-52 flex-col rounded-xl border border-sand bg-white p-2 shadow-lg shadow-navy/15"
    >
      <p id="filter-sort-menu-title" class="px-2 pt-1 pb-1 text-xs leading-4 font-normal text-grey">Sorteren op</p>
      <!-- role="group" with aria-labelledby: screen readers read "Sorteren op" before the choices.
           aria-pressed tells which choice is on -->
      <div role="group" aria-labelledby="filter-sort-menu-title" class="flex flex-col">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :aria-pressed="modelValue === option.value"
          class="flex min-h-11 items-center gap-2 rounded-xl px-2 text-left text-sm leading-5 font-normal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
          :class="modelValue === option.value ? 'text-blue' : 'text-navy'"
          @click="choose(option)"
        >
          <!-- The check shows the chosen option. The other options get an empty space of the same size,
               so all texts start at the same line -->
          <IconDisplay v-if="modelValue === option.value" name="check" class="size-4 shrink-0" />
          <span v-else class="size-4 shrink-0" aria-hidden="true" />
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
