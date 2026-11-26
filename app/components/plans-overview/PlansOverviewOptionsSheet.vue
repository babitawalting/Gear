<!-- app/components/plans-overview/PlansOverviewOptionsSheet.vue
     The sheet that slides up from the bottom when the user taps the three dots on a plan card in the plan overview.
     It offers two options under each other: "Plan delen" (Primary) and "Plan archiveren" (Secondary, not the main action),
     and an "Annuleren" button to close the sheet.
     An archived plan can not be shared or archived again: for it the sheet only offers "Plan uit archief halen" (and "Annuleren").
     It is a native <dialog>, just like the category sheet: the browser gives us the blurred background,
     closing with Escape and keeping the keyboard focus inside the sheet.
     Usage: <PlansOverviewOptionsSheet :open="isSheetOpen" title="Rijbewijs BE" @close="isSheetOpen = false" @archive="archive" @share="share" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the sheet is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
    // The title of the plan, used in the text
    title: { type: String, default: "" },
    // True for a plan that is already archived: then the options are "Plan uit archief halen" instead of sharing and archiving
    isArchived: { type: Boolean, default: false },
  },
  // "close": the user closed the sheet (a click next to the sheet or Escape)
  // "archive": the user chose "Plan archiveren"
  // "share": the user chose "Plan delen"
  // "unarchive": the user chose "Plan uit archief halen" (only for an archived plan)
  emits: ["close", "archive", "share", "unarchive"],
  watch: {
    // Runs every time the `open` prop changes
    open(isOpen: boolean) {
      this.syncDialog(isOpen);
    },
  },
  // mounted() runs once, when the component is on the page. The sheet could already be open then
  mounted() {
    this.syncDialog(this.open);
  },
  methods: {
    // Opens or closes the real <dialog> so it matches the `open` prop
    syncDialog(isOpen: boolean) {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (isOpen && !dialog.open) {
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    },
  },
});
</script>

<template>
  <!-- The dialog itself has no padding, so a click on `self` can only be a click on the blurred background.
       mx-auto + max-w-[402px]: the sheet is only as wide as the page column (the phone screen), also on a wide window -->
  <dialog
    ref="dialog"
    aria-labelledby="options-sheet-title"
    class="fixed inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-[402px] rounded-t-3xl border border-b-0 border-sand bg-white p-0 backdrop:bg-white/40 backdrop:backdrop-blur-sm"
    @click.self="$emit('close')"
    @close="$emit('close')"
  >
    <div class="flex flex-col px-6 pt-7.5 pb-10">
      <h2 id="options-sheet-title" class="text-[26px] leading-8 font-semibold text-navy">Plan opties</h2>
      <p class="text-sm leading-5 font-normal text-grey">Wat wilt u doen met "{{ title }}"?</p>

      <!-- The options and "Annuleren" are under each other, as wide as the sheet (gap-4 between them, mt-8 under the text
           like the buttons of the category sheet). A little white space is fine: the sheet is a bit higher on purpose -->
      <div class="mt-8 flex flex-col gap-4">
        <!-- An archived plan only has one option: take it out of the archive. It is the main action, so it is blue -->
        <PrimaryButton v-if="isArchived" label="Plan uit archief halen" @click="$emit('unarchive')" />
        <template v-else>
          <PrimaryButton label="Plan delen" icon="share" @click="$emit('share')" />
          <SecondaryButton label="Plan archiveren" icon="archive" @click="$emit('archive')" />
        </template>
        <CancelButton label="Annuleren" @click="$emit('close')" />
      </div>
    </div>
  </dialog>
</template>
