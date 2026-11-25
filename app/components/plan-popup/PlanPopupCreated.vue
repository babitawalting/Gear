<!-- app/components/plan-popup/PlanPopupCreated.vue
     The popup that tells the user "Plan aangemaakt!" after a new plan was saved.
     It has one button, "Naar mijn plannen". The parent then goes to the plans overview (/plans-overview).
     Escape and a tap on the background do nothing, so the user always continues with the button.
     This popup does not change the page itself: it only tells the parent that the button was pressed.
     Usage: <PlanPopupCreated :open="isCreatedPopupOpen" @go-to-plans="goToPlansOverview" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the popup is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
  },
  // "go-to-plans": the user pressed "Naar mijn plannen"
  emits: ["go-to-plans"],
});
</script>

<template>
  <PlanPopupDialog
    id="plan-popup-created"
    :open="open"
    icon="check"
    title="Plan aangemaakt!"
    :text="'Je plan is succesvol aangemaakt.\nJe kunt je plan terugvinden in je plannenoverzicht!'"
  >
    <PrimaryButton label="Naar mijn plannen" @click="$emit('go-to-plans')" />
  </PlanPopupDialog>
</template>
