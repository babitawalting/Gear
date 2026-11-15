<!-- app/components/plan/overview/category-sheet/PlanOverviewCategorySheetCancelButton.vue
     The "Annuleren" button of the category sheet (Cancel state of the skill: white, sand border, grey text).
     Usage: <PlanOverviewCategorySheetCancelButton @click="close" /> -->
<script lang="ts">
export default defineComponent({
  // No props or emits needed: a @click on this component automatically goes to the <button> below
});
</script>

<template>
  <button
    type="button"
    class="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-grey focus-visible:outline-2 focus-visible:outline-blue"
  >
    Annuleren
  </button>
</template>
