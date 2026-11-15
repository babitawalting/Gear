<!-- app/components/plan-overview/category-sheet/PlanOverviewCategorySheetStartButton.vue
     The "Plan starten" button of the category sheet. It is grey and disabled until a category is chosen,
     then it turns into the Primary state of the skill (blue with white text).
     Usage: <PlanOverviewCategorySheetStartButton :disabled="category === ''" @click="start" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True while no category is chosen yet: the button is grey and can't be used
    disabled: { type: Boolean, default: false },
  },
  // No emits needed: a @click on this component automatically goes to the <button> below
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="disabled ? 'bg-grey' : 'bg-blue'"
    class="flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
  >
    Plan starten
  </button>
</template>
