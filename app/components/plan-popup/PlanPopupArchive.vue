<!-- app/components/plan-popup/PlanPopupArchive.vue
     The popup that asks "Plan archiveren?" before the user archives a plan.
     - "Terug": closes the popup, the plan is not archived.
     - "Archiveren": the user confirms. The parent archives the plan and then goes to the plans overview.
     Escape or a tap on the background does the same as "Terug", because that is the safe choice.
     This popup does not archive anything or change the page itself: it only tells the parent what was chosen.
     Usage: <PlanPopupArchive :open="isArchivePopupOpen" @close="isArchivePopupOpen = false" @confirm="archivePlan" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the popup is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
  },
  // "close": the user does not want to archive ("Terug", Escape or a tap on the background)
  // "confirm": the user pressed "Archiveren"
  emits: ["close", "confirm"],
});
</script>

<template>
  <PlanPopupDialog
    id="plan-popup-archive"
    :open="open"
    icon="archive"
    title="Plan archiveren?"
    :text="'Weet je zeker dat je dit plan wilt archiveren?\nJe kunt het terugvinden in je archief.'"
    dismissible
    @dismiss="$emit('close')"
  >
    <PlanPopupButtonRow
      secondary-label="Terug"
      primary-label="Archiveren"
      @secondary="$emit('close')"
      @primary="$emit('confirm')"
    />
  </PlanPopupDialog>
</template>
