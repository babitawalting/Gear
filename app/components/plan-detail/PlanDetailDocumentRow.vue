<!-- app/components/plan-detail/PlanDetailDocumentRow.vue
     One document in the list of an open step: the name on the left and a blue edit button on the right.
     There is a thin line under the row. The edit button does nothing yet: it only tells the page it was tapped.
     Usage: <PlanDetailDocumentRow title="Rijbewijs B" @edit="editDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the document, in Dutch
    title: { type: String, required: true },
  },
  // Tells the page that the edit button was tapped
  emits: ["edit"],
});
</script>

<template>
  <div class="flex h-10.5 items-center justify-between gap-3 border-b border-sand">
    <span class="min-w-0 truncate text-xs font-semibold text-navy">{{ title }}</span>
    <!-- The button looks 28px, but before:-inset-2 makes the tappable area 44px (the skill's minimum) -->
    <button
      type="button"
      :aria-label="`${title} bewerken`"
      class="relative flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue text-white before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="$emit('edit')"
    >
      <IconDisplay name="edit" class="size-3" />
    </button>
  </div>
</template>
