<!-- app/components/shared/DocumentRow.vue
     One document in the list of an open step: the name on the left and a blue pencil button on the right.
     A thin line under the row is only shown when `has-line` is set. The page sets it when the list has 2 or more documents.
     - Tapping the pencil puts the row in edit mode: a "Verwijderen" button appears, and the pencil turns into a grey cross.
       "Verwijderen" tells the page to take the document out of the plan (event `remove`). The cross closes edit mode.
     - When the user does not have the document yet (`is-missing`), the pencil is replaced by a blue "+ Toevoegen" button
       (event `add`).
     Usage: <DocumentRow title="CV" :has-line="documents.length > 1" @remove="removeDocument" />
            <DocumentRow title="Rijbewijs B" is-missing @add="addDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the document, in Dutch
    title: { type: String, required: true },
    // True when the thin line under the row is shown. Without it the row keeps the same height (the line is see-through)
    hasLine: { type: Boolean, default: false },
    // True when the user does not have this document in the vault yet: a "+ Toevoegen" button shows
    isMissing: { type: Boolean, default: false },
    // True while the step is locked: the "+ Toevoegen" button stays visible, but is grey and can't be used yet
    isDisabled: { type: Boolean, default: false },
    // The text on the add button, in Dutch (the "+" is an icon)
    addLabel: { type: String, default: "Toevoegen" },
    // False hides the pencil, for example in a locked step where nothing can be changed yet
    canEdit: { type: Boolean, default: true },
  },
  // "add": the "+ Toevoegen" button was tapped. "remove": "Verwijderen" was tapped in edit mode
  emits: ["add", "remove"],
  data() {
    return {
      // True while the "Verwijderen" button is shown
      isEditing: false,
    };
  },
  methods: {
    toggleEditing() {
      this.isEditing = !this.isEditing;
    },
    remove() {
      this.isEditing = false;
      this.$emit("remove");
    },
  },
});
</script>

<template>
  <div
    class="flex h-10.5 items-center justify-between gap-3 border-b"
    :class="hasLine ? 'border-sand' : 'border-transparent'"
  >
    <span class="min-w-0 flex-1 truncate text-xs font-semibold text-navy">{{ title }}</span>

    <!-- The missing document: a blue "+ Toevoegen" button. The hidden title (sr-only) tells screen readers what is added -->
    <button
      v-if="isMissing"
      type="button"
      :disabled="isDisabled"
      class="relative flex h-7 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-normal text-white before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      :class="isDisabled ? 'bg-grey' : 'bg-blue'"
      @click="$emit('add')"
    >
      <IconDisplay name="plus" class="size-3" />
      {{ addLabel }}<span class="sr-only"> {{ title }}</span>
    </button>

    <template v-else-if="canEdit">
      <!-- Edit mode: the remove button appears in the same row, next to the cross (Secondary state, small) -->
      <button
        v-if="isEditing"
        type="button"
        class="relative flex h-7 shrink-0 items-center rounded-xl border border-sand bg-white px-3 text-xs font-normal text-blue before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        @click="remove"
      >
        Verwijderen<span class="sr-only"> {{ title }} uit dit plan</span>
      </button>
      <!-- One button for both moments (pencil and cross), so the keyboard focus stays on it when it changes.
           It looks 28px, but before:-inset-2 makes the tappable area 44px (the skill's minimum) -->
      <button
        type="button"
        :aria-label="isEditing ? 'Bewerken annuleren' : `${title} bewerken`"
        :aria-expanded="isEditing"
        class="relative flex size-7 shrink-0 items-center justify-center rounded-xl text-white before:absolute before:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="isEditing ? 'bg-grey' : 'bg-blue'"
        @click="toggleEditing"
      >
        <IconDisplay :name="isEditing ? 'xmark' : 'edit'" class="size-3" />
      </button>
    </template>
  </div>
</template>
