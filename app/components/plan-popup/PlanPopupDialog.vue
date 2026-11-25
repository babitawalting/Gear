<!-- app/components/plan-popup/PlanPopupDialog.vue
     The shared base for the plan popups (PlanPopupCancel and PlanPopupCreated).
     It draws the card in the middle of the screen: a round blue icon, a title, a short text and the buttons.
     The buttons are not part of this file: each popup puts its own buttons in the <slot />.
     Like the category sheet, it is a native <dialog>: the browser gives us the darker, blurred background
     and keeps the keyboard focus inside the popup.
     Usage: <PlanPopupDialog id="my-popup" :open="isOpen" icon="check" title="Klaar!" text="Het is gelukt." @dismiss="isOpen = false">
              <PrimaryButton label="Oké" @click="isOpen = false" />
            </PlanPopupDialog> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the popup is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
    // A unique name for this popup, used to link the title and text to the dialog for screen readers
    id: { type: String, required: true },
    // The icon in the blue circle, a name from app/utils/icons.ts (for example "check" or "xmark")
    icon: { type: String, required: true },
    // The title, in Dutch
    title: { type: String, required: true },
    // The text under the title, in Dutch. A "\n" in the text starts a new line
    text: { type: String, required: true },
    // True: Escape and a tap on the background ask to close the popup (the "dismiss" event).
    // False: they do nothing, so the user has to use one of the buttons
    dismissible: { type: Boolean, default: false },
  },
  // "dismiss": the user pressed Escape or tapped the background (only when `dismissible` is true)
  emits: ["dismiss"],
  computed: {
    titleId(): string {
      return `${this.id}-title`;
    },
    textId(): string {
      return `${this.id}-text`;
    },
  },
  watch: {
    // Runs every time the `open` prop changes
    open(isOpen: boolean) {
      this.syncDialog(isOpen);
    },
  },
  // mounted() runs once, when the component is on the page. The popup could already be open then
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
    // The browser fires "cancel" when the user presses Escape. Normally that closes the dialog by itself.
    // We stop that (preventDefault), so only the parent decides when the popup closes
    handleCancel(event: Event) {
      event.preventDefault();
      if (this.dismissible) {
        this.$emit("dismiss");
      }
    },
    // A tap on the background
    handleBackgroundClick() {
      if (this.dismissible) {
        this.$emit("dismiss");
      }
    },
    // Some browsers (like Chrome) still close the dialog when Escape is pressed twice quickly.
    // If the parent still wants it open, we ask to close (dismissible) or open it again (not dismissible)
    handleClose() {
      if (!this.open) return;
      if (this.dismissible) {
        this.$emit("dismiss");
      } else {
        // setTimeout(..., 0) waits until the browser has completely finished closing, otherwise it closes it again
        setTimeout(() => {
          const dialog = this.$refs.dialog as HTMLDialogElement | undefined;
          if (this.open && dialog && !dialog.open) {
            dialog.showModal();
          }
        }, 0);
      }
    },
  },
});
</script>

<template>
  <!-- m-auto puts the dialog in the middle of the screen.
       The width is the screen minus 24px on each side (the same margin as the pages), at most 354px (402 - 2 x 24).
       backdrop: styles the layer behind the popup: a little darker (navy at 20%) and a bit blurred.
       The dialog has no padding, so a click on `self` can only be a click on the background.
       closedby="none" tells newer browsers that Escape may not close a popup that is not dismissible.
       Older browsers don't know it, for them handleClose() opens the popup again -->
  <dialog
    ref="dialog"
    :closedby="dismissible ? 'closerequest' : 'none'"
    :aria-labelledby="titleId"
    :aria-describedby="textId"
    class="m-auto w-[calc(100%-48px)] max-w-[354px] bg-transparent p-0 backdrop:bg-navy/20 backdrop:backdrop-blur-[2px]"
    @cancel="handleCancel"
    @close="handleClose"
    @click.self="handleBackgroundClick"
  >
    <div class="flex flex-col items-center rounded-xl border border-sand bg-white px-6 pt-3 pb-5 text-center">
      <!-- The round blue icon (42px, as in the design). The icon follows the white text color -->
      <span class="flex size-10.5 items-center justify-center rounded-full bg-blue text-white">
        <IconDisplay :name="icon" class="size-5" />
      </span>

      <!-- -mx-3: like the text below, the title may use 12px of the card's side padding, so it stays on one line.
           Screens narrower than 360px get 26px (the size of the sheet titles), from 360px it is 32px as in the design.
           min-[360px]: means "from a screen width of 360px". Very narrow screens still wrap naturally -->
      <h2
        :id="titleId"
        class="-mx-3 mt-1.5 text-[26px] leading-8 font-semibold text-navy min-[360px]:text-[32px] min-[360px]:leading-9"
      >
        {{ title }}
      </h2>
      <!-- whitespace-pre-line: a "\n" in the text becomes a new line.
           -mx-3: the text may use 12px of the card's side padding, so each sentence fits on one line on most phones.
           max-w-[290px]: never wider than the text in the Figma design, so long sentences still wrap like there.
           On very small screens the text wraps naturally -->
      <p :id="textId" class="-mx-3 mt-3 max-w-[290px] text-sm leading-5 font-normal whitespace-pre-line text-grey">{{ text }}</p>

      <!-- The buttons of the popup that uses this base -->
      <div class="mt-7 w-full">
        <slot />
      </div>
    </div>
  </dialog>
</template>
