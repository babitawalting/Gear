<!-- app/components/plan-popup/PlanPopupCancel.vue
     The popup that asks "Plan annuleren?" before the user cancels the plan they are making.
     - "Verder met plan": closes the popup, the user goes on with the plan (nothing is lost).
     - "Plan annuleren": the user confirms. The parent cancels the plan and then goes to the plans overview.
     Escape or a tap on the background does the same as "Verder met plan", because that is the safe choice.
     This popup does not cancel anything or change the page itself: it only tells the parent what was chosen.
     Usage: <PlanPopupCancel :open="isCancelPopupOpen" @continue="isCancelPopupOpen = false" @confirm="cancelPlan" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the popup is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
  },
  // "continue": the user wants to go on with the plan ("Verder met plan", Escape or a tap on the background)
  // "confirm": the user pressed "Plan annuleren"
  emits: ["continue", "confirm"],
});
</script>

<template>
  <PlanPopupDialog
    id="plan-popup-cancel"
    :open="open"
    icon="xmark"
    title="Plan annuleren?"
    :text="'Weet je zeker dat je dit plan wilt annuleren?\nJe voortgang wordt niet opgeslagen.'"
    dismissible
    @dismiss="$emit('continue')"
  >
    <PlanPopupButtonRow
      secondary-label="Verder met plan"
      primary-label="Plan annuleren"
      @secondary="$emit('continue')"
      @primary="$emit('confirm')"
    />
  </PlanPopupDialog>
</template>
