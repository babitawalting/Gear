<!-- app/components/plan-detail/PlanDetailDocumentRow.vue
     One document in the list of an open step: the name on the left and a blue edit button on the right.
     A thin line under the row is only shown when `has-line` is set. The page sets it when the list has 2 or more documents.
     When the user does not have the document yet (`is-missing`), the edit button is replaced by a blue "+ Toevoegen" button.
     Both buttons do nothing yet: they only tell the page they were tapped (`edit` and `add`).
     Usage: <PlanDetailDocumentRow title="Rijbewijs B" :has-line="documents.length > 1" @edit="editDocument" />
            <PlanDetailDocumentRow title="Rijbewijs B" is-missing @add="addDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the document, in Dutch
    title: { type: String, required: true },
    // True when the thin line under the row is shown. Without it the row keeps the same height (the line is see-through)
    hasLine: { type: Boolean, default: false },
    // True when the user does not have this document in the vault yet: a "+ Toevoegen" button shows
    isMissing: { type: Boolean, default: false },
  },
  // "edit": the edit button was tapped. "add": the "+ Toevoegen" button was tapped
  emits: ["edit", "add"],
});
</script>

<template>
  <div
    class="flex h-10.5 items-center justify-between gap-3 border-b"
    :class="hasLine ? 'border-sand' : 'border-transparent'"
  >
    <span class="min-w-0 truncate text-xs font-semibold text-navy">{{ title }}</span>
    <!-- The missing document: a blue "+ Toevoegen" button. The hidden title (sr-only) tells screen readers what is added -->
    <button
      v-if="isMissing"
      type="button"
      class="relative flex h-7 shrink-0 items-center gap-1.5 rounded-xl bg-blue px-3 text-xs font-normal text-white before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="$emit('add')"
    >
      <IconDisplay name="plus" class="size-3" />
      Toevoegen<span class="sr-only"> {{ title }}</span>
    </button>
    <!-- The button looks 28px, but before:-inset-2 makes the tappable area 44px (the skill's minimum) -->
    <button
      v-else
      type="button"
      :aria-label="`${title} bewerken`"
      class="relative flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue text-white before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="$emit('edit')"
    >
      <IconDisplay name="edit" class="size-3" />
    </button>
  </div>
</template>
