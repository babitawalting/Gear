<!-- app/components/vault/VaultDeleteSheet.vue
     The sheet that asks "Document verwijderen?" on the page of a document. Deleting can't be undone,
     so the user has to confirm it here first.
     It works like the other drawers: a native <dialog> that gives us the blurred background, closing with Escape and keeping
     the keyboard focus inside. It closes with a swipe down, a tap next to it or "Annuleren".
     Usage: <VaultDeleteSheet :open="isDeleteSheetOpen" :title="document.title" @close="isDeleteSheetOpen = false" @delete="deleteDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the sheet is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
    // The title of the document, used in the question
    title: { type: String, default: "" },
  },
  // "close": the user cancelled ("Annuleren", swiping it down, a tap next to it or Escape)
  // "delete": the user confirmed "Verwijderen"
  emits: ["close", "delete"],
  data() {
    return {
      // For swiping the sheet down. isPressing: a finger (or mouse button) is down on the sheet.
      // isDragging: it moved far enough down, so the sheet moves with it
      isPressing: false,
      isDragging: false,
      // Where the finger (or mouse) was when the drag started, in pixels from the top of the screen
      dragStartY: 0,
      // How far the sheet is dragged down right now, in pixels
      dragOffset: 0,
    };
  },
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
    // Swiping down, the same as in the other drawers. A swipe only starts after the finger moved 10px down,
    // so a normal tap on a button still works
    startDrag(event: PointerEvent) {
      this.isPressing = true;
      this.dragStartY = event.clientY;
    },
    moveDrag(event: PointerEvent) {
      if (!this.isPressing) return;
      const distance = event.clientY - this.dragStartY;
      if (!this.isDragging && distance > 10) {
        this.isDragging = true;
        // Keeps sending the moves to the sheet, also when the finger leaves it.
        // Because the sheet takes over the finger, letting go does not count as a tap on the button under it
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      }
      // Only downwards: dragging up does nothing (Math.max keeps it at 0 or more)
      if (this.isDragging) {
        this.dragOffset = Math.max(0, distance);
      }
    },
    endDrag() {
      this.isPressing = false;
      if (!this.isDragging) return;
      this.isDragging = false;
      // Dragged far enough (more than 100px): close the sheet. Otherwise it slides back up
      if (this.dragOffset > 100) {
        this.$emit("close");
      }
      this.dragOffset = 0;
    },
  },
});
</script>

<template>
  <!-- The dialog itself has no padding, so a click on `self` can only be a click on the blurred background.
       mx-auto + max-w-[402px]: the sheet is only as wide as the page column, like a phone screen -->
  <dialog
    ref="dialog"
    aria-labelledby="delete-sheet-title"
    aria-describedby="delete-sheet-text"
    class="fixed inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-[402px] rounded-t-3xl border border-b-0 border-sand bg-white p-0 backdrop:bg-white/40 backdrop:backdrop-blur-sm"
    :class="isDragging ? '' : 'transition-transform duration-200'"
    :style="{ transform: `translateY(${dragOffset}px)` }"
    @click.self="$emit('close')"
    @close="$emit('close')"
  >
    <!-- The whole sheet can be swiped down. touch-none stops the browser from scrolling the page while the user swipes -->
    <div
      class="flex touch-none flex-col px-6 pt-3 pb-7 select-none"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <!-- The small bar shows that the sheet can be swiped. aria-hidden: screen reader users close with Escape -->
      <div aria-hidden="true" class="mx-auto h-1 w-10 rounded-full bg-grey" />
      <h2 id="delete-sheet-title" class="mt-3.5 text-[26px] leading-8 font-semibold text-navy">Document verwijderen?</h2>
      <!-- aria-describedby on the dialog: screen readers read this text together with the question -->
      <p id="delete-sheet-text" class="text-sm leading-5 font-normal text-grey">
        "{{ title }}" wordt uit uw kluis en uit uw plannen gehaald. Dit kunt u niet ongedaan maken.
      </p>

      <!-- flex-wrap: when both buttons don't fit next to each other (small phones), the second one goes under the first.
           Both then fill the whole width, because they have flex-1 -->
      <div class="mt-8 flex flex-wrap gap-4">
        <CancelButton label="Annuleren" @click="$emit('close')" />
        <PrimaryButton label="Verwijderen" @click="$emit('delete')" />
      </div>
    </div>
  </dialog>
</template>
