<!-- app/components/plan-popup/PlanPopupButtonRow.vue
     Two buttons next to each other at the bottom of a plan popup, used by PlanPopupCancel and PlanPopupArchive.
     - Left: the safe choice, in the Secondary state (white, sand border, blue text). It comes first,
       so the keyboard focus starts on the safe choice when the popup opens.
     - Right: the main action, the shared PrimaryButton.
     The row does not know what the buttons do: it only tells the popup which one was pressed.
     Usage: <PlanPopupButtonRow secondary-label="Terug" primary-label="Archiveren" @secondary="close" @primary="archive" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The text of the left (Secondary) button, in Dutch
    secondaryLabel: { type: String, required: true },
    // The text of the right (Primary) button, in Dutch
    primaryLabel: { type: String, required: true },
  },
  // "secondary": the left button was pressed
  // "primary": the right button was pressed
  emits: ["secondary", "primary"],
});
</script>

<template>
  <!-- The buttons stay next to each other. From 402px (the design width) they look exactly like the design: gap of 24px.
       On smaller phones the row may use 12px of the card's side padding (-mx-3) and the gap is 8px,
       so the button text still fits on one line. On very narrow screens the text wraps naturally -->
  <div class="-mx-3 flex gap-2 min-[402px]:mx-0 min-[402px]:gap-6">
    <!-- Secondary state: an alternative choice (white, sand border, blue text) -->
    <button
      type="button"
      class="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-blue focus-visible:outline-2 focus-visible:outline-blue"
      @click="$emit('secondary')"
    >
      {{ secondaryLabel }}
    </button>
    <PrimaryButton :label="primaryLabel" @click="$emit('primary')" />
  </div>
</template>
