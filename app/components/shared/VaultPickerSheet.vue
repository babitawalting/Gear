<!-- app/components/shared/VaultPickerSheet.vue
     The drawer that slides up from the bottom when the user taps "Bewijs toevoegen uit kluis" in a plan step.
     It shows all documents in the vault, with a search field and the category filters of the vault.
     The user chooses one or more documents and presses "Toevoegen".
     It works like the other drawers (SharePlanSheet, PlanCategorySheet): a native <dialog> that gives us the blurred
     background, closing with Escape and keeping the keyboard focus inside. It closes with a swipe down or a tap next to it.
     Usage: <VaultPickerSheet :open="isVaultOpen" :hidden-ids="idsAlreadyInStep" @close="isVaultOpen = false" @add="addEvidence" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the drawer is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
    // The ids of documents that are already in the step: they are left out of the list, so they can't be added twice
    hiddenIds: { type: Array as PropType<string[]>, default: () => [] },
  },
  // "close": the user closed the drawer (swiping it down, a tap next to it or Escape)
  // "add": the user pressed "Toevoegen", the value is a list with the ids of the chosen documents
  emits: ["close", "add"],
  data() {
    return {
      // What the user typed in the search field
      search: "",
      // The chosen category filter, for example "certificates". Empty means all categories
      category: "",
      // The category filters for the FilterBar, from app/utils/vaultDocuments.ts
      filters: vaultCategories,
      // The ids of the chosen documents
      selectedIds: [] as string[],
      // For swiping the drawer down. isPressing: a finger (or mouse button) is down on the drawer.
      // isDragging: it moved far enough down, so the drawer moves with it
      isPressing: false,
      isDragging: false,
      // Where the finger (or mouse) was when the drag started, in pixels from the top of the screen
      dragStartY: 0,
      // How far the drawer is dragged down right now, in pixels
      dragOffset: 0,
      // True when the list is longer than its space, so it can scroll (see measureList)
      isListScrollable: false,
    };
  },
  computed: {
    // The documents that match the search (on name) and the chosen category, newest first.
    // The ones that are already in the step are left out
    filteredDocuments(): VaultDocument[] {
      const searchText = this.search.trim().toLowerCase();
      return vaultDocuments
        .filter((document) => !this.hiddenIds.includes(document.id))
        .filter((document) => this.category === "" || document.category === this.category)
        .filter((document) => document.title.toLowerCase().includes(searchText))
        // "2026-09-17" texts can be compared like words: a later date comes later in the alphabet
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    hasSelection(): boolean {
      return this.selectedIds.length > 0;
    },
  },
  watch: {
    // Runs every time the `open` prop changes
    open(isOpen: boolean) {
      this.syncDialog(isOpen);
    },
    // Searching makes the list shorter or longer, so we measure it again
    search() {
      this.measureList();
    },
  },
  // mounted() runs once, when the component is on the page. The drawer could already be open then
  mounted() {
    this.syncDialog(this.open);
  },
  methods: {
    // Opens or closes the real <dialog> so it matches the `open` prop. Opening starts empty again
    syncDialog(isOpen: boolean) {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (isOpen && !dialog.open) {
        this.search = "";
        this.category = "";
        this.selectedIds = [];
        dialog.showModal();
        this.measureList();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    },
    isSelected(document: VaultDocument): boolean {
      return this.selectedIds.includes(document.id);
    },
    // Chooses the document, or un-chooses it when it was already chosen
    toggleDocument(document: VaultDocument) {
      if (this.isSelected(document)) {
        this.selectedIds = this.selectedIds.filter((id) => id !== document.id);
      } else {
        this.selectedIds.push(document.id);
      }
    },
    // Swiping down. Pointer events work for both a finger and a mouse.
    // The whole drawer can be swiped, not only the top. A swipe only starts after the finger moved 10px down,
    // so a normal tap on a document or a button still works
    startDrag(event: PointerEvent) {
      const target = event.target as HTMLElement;
      const list = this.$refs.list as HTMLElement;
      // Not in the search field (there the mouse selects text), and not in the list while it is scrolled down
      // (then swiping down scrolls the list back up first)
      if (target.closest("input") || (list.contains(target) && list.scrollTop > 0)) return;
      this.isPressing = true;
      this.dragStartY = event.clientY;
    },
    moveDrag(event: PointerEvent) {
      if (!this.isPressing) return;
      const distance = event.clientY - this.dragStartY;
      if (!this.isDragging && distance > 10) {
        this.isDragging = true;
        // Keeps sending the moves to the drawer, also when the finger leaves it. Because the drawer takes over the finger,
        // letting go does not count as a tap on the document or button under it
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
      // Dragged far enough (more than 100px): close the drawer. Otherwise it slides back up
      if (this.dragOffset > 100) {
        this.$emit("close");
      }
      this.dragOffset = 0;
    },
    // Checks if the list can scroll. $nextTick waits until Vue has updated the page, so the list has its new length.
    // A list that can scroll lets the finger scroll it (touch-pan-y), a short list lets the finger swipe the drawer
    measureList() {
      this.$nextTick(() => {
        const list = this.$refs.list as HTMLElement;
        this.isListScrollable = list.scrollHeight > list.clientHeight;
      });
    },
    handleAdd() {
      this.$emit("add", this.selectedIds);
    },
  },
});
</script>

<template>
  <!-- The dialog itself has no padding, so a click on `self` can only be a click on the blurred background.
       mx-auto + max-w-[402px]: the drawer is only as wide as the page column, like a phone screen -->
  <dialog
    ref="dialog"
    aria-labelledby="vault-sheet-title"
    class="fixed inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-[402px] rounded-t-3xl border border-b-0 border-sand bg-white p-0 backdrop:bg-white/40 backdrop:backdrop-blur-sm"
    :class="isDragging ? '' : 'transition-transform duration-200'"
    :style="{ transform: `translateY(${dragOffset}px)` }"
    @click.self="$emit('close')"
    @close="$emit('close')"
  >
    <!-- The drawer is at most 2/3 of the screen high (dvh = the visible height on a phone).
         Only the list of documents scrolls: the title, search field, filters and "Toevoegen" stay in place -->
    <div
      class="flex max-h-[calc(100dvh*2/3)] flex-col px-6 pt-3 pb-7 select-none"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <!-- touch-none (here and on the other parts) stops the browser from scrolling the page while the user swipes the drawer -->
      <div class="touch-none pb-1">
        <!-- The small bar shows that the drawer can be swiped. aria-hidden: screen reader users close with Escape -->
        <div aria-hidden="true" class="mx-auto h-1 w-10 rounded-full bg-grey" />
        <h2 id="vault-sheet-title" class="mt-3.5 text-[26px] leading-8 font-semibold text-navy">Bewijs toevoegen</h2>
        <p class="text-sm leading-5 font-normal text-grey">Kies documenten uit uw kluis</p>
      </div>

      <div class="mt-5 touch-none">
        <SearchBar v-model="search" placeholder="Zoek in mijn kluis..." />
      </div>

      <!-- The category filters of the vault. Tapping a chosen filter again shows all documents.
           touch-pan-x: the finger can still scroll the filters sideways, a swipe down moves the drawer -->
      <div class="mt-4 touch-pan-x">
        <FilterBar v-model="category" :filters="filters" />
      </div>

      <!-- The scroll area: min-h-0 + flex-1 let it shrink to the space that is left, overflow-y-auto makes it scroll.
           pb-16 keeps space under the last document, so it never sits against the button.
           px-1/-mx-1 and pt-1 give the focus outline of a row room, so the scroll area doesn't cut it off.
           [scrollbar-width:none] hides the scrollbar (swiping and the mouse wheel still work) -->
      <div
        ref="list"
        class="-mx-1 mt-4 min-h-0 flex-1 overflow-y-auto px-1 pt-1 pb-16 [scrollbar-width:none]"
        :class="isListScrollable ? 'touch-pan-y' : 'touch-none'"
      >
        <ul class="flex flex-col gap-3">
          <li v-for="document in filteredDocuments" :key="document.id">
            <VaultPickerRow
              :title="document.title"
              :category="document.category"
              :date="document.date"
              :is-selected="isSelected(document)"
              @toggle="toggleDocument(document)"
            />
          </li>
        </ul>
        <!-- Shown when the search and filter find nothing. role="status": screen readers announce it -->
        <p v-if="filteredDocuments.length === 0" role="status" class="text-sm font-normal text-grey">Geen documenten gevonden.</p>
      </div>

      <!-- The bottom button, always visible. Grey and disabled until at least one document is chosen -->
      <div class="shrink-0 touch-none">
        <PrimaryButton label="Toevoegen" icon="plus" :disabled="!hasSelection" @click="handleAdd" />
      </div>
    </div>
  </dialog>
</template>
