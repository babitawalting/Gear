<!-- app/components/share-plan/SharePlanSheet.vue
     The sheet that slides up from the bottom to share a plan with other people.
     The user can search, chooses one or more people from the list and presses "Plan delen".
     It is a native <dialog>, just like the category sheet: the browser gives us the blurred background,
     closing with Escape and keeping the keyboard focus inside the sheet.
     Usage: <SharePlanSheet :open="isShareSheetOpen" :contacts="contacts" @close="isShareSheetOpen = false" @share="sharePlan" />
            contacts looks like: [{ id: "1", name: "Anna Jansen", organisation: "Fontys" }] -->
<script lang="ts">
// The shape of one person in the list, so TypeScript knows which fields a contact has
interface Contact {
  id: string;
  name: string;
  organisation: string;
}

export default defineComponent({
  props: {
    // True when the sheet is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
    // The people the plan was recently shared with
    contacts: { type: Array as PropType<Contact[]>, required: true },
  },
  // "close": the user closed the sheet (swiping it down, a tap next to the sheet or Escape)
  // "share": the user pressed "Plan delen", the value is a list with the ids of the chosen people
  emits: ["close", "share"],
  data() {
    return {
      // What the user typed in the search field
      search: "",
      // The ids of the chosen people
      selectedIds: [] as string[],
      // For swiping the sheet down: true while the user is dragging the top of the sheet
      isDragging: false,
      // Where the finger (or mouse) was when the drag started, in pixels from the top of the screen
      dragStartY: 0,
      // How far the sheet is dragged down right now, in pixels
      dragOffset: 0,
    };
  },
  computed: {
    // The people that match the search, on name or organisation. Upper and lower case don't matter
    filteredContacts(): Contact[] {
      const searchText = this.search.trim().toLowerCase();
      return this.contacts.filter((contact) => {
        return (
          contact.name.toLowerCase().includes(searchText)
          || contact.organisation.toLowerCase().includes(searchText)
        );
      });
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
  },
  // mounted() runs once, when the component is on the page. The sheet could already be open then
  mounted() {
    this.syncDialog(this.open);
  },
  methods: {
    // Opens or closes the real <dialog> so it matches the `open` prop. Opening starts empty again
    syncDialog(isOpen: boolean) {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (isOpen && !dialog.open) {
        this.search = "";
        this.selectedIds = [];
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    },
    isSelected(contact: Contact): boolean {
      return this.selectedIds.includes(contact.id);
    },
    // Chooses the person, or un-chooses them when they were already chosen
    toggleContact(contact: Contact) {
      if (this.isSelected(contact)) {
        this.selectedIds = this.selectedIds.filter((id) => id !== contact.id);
      } else {
        this.selectedIds.push(contact.id);
      }
    },
    // Swiping down. Pointer events work for both a finger and a mouse
    startDrag(event: PointerEvent) {
      this.isDragging = true;
      this.dragStartY = event.clientY;
      // Keeps sending the moves to this element, also when the finger leaves it
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    },
    moveDrag(event: PointerEvent) {
      if (!this.isDragging) return;
      // Only downwards: dragging up does nothing (Math.max keeps it at 0 or more)
      this.dragOffset = Math.max(0, event.clientY - this.dragStartY);
    },
    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      // Dragged far enough (more than 100px): close the sheet. Otherwise it slides back up
      if (this.dragOffset > 100) {
        this.$emit("close");
      }
      this.dragOffset = 0;
    },
    handleShare() {
      this.$emit("share", this.selectedIds);
    },
  },
});
</script>

<template>
  <!-- The dialog itself has no padding, so a click on `self` can only be a click on the blurred background.
       mx-auto + max-w-[402px]: the sheet is only as wide as the page column, like a phone screen -->
  <dialog
    ref="dialog"
    aria-labelledby="share-sheet-title"
    class="fixed inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-[402px] rounded-t-3xl border border-b-0 border-sand bg-white p-0 backdrop:bg-white/40 backdrop:backdrop-blur-sm"
    :class="isDragging ? '' : 'transition-transform duration-200'"
    :style="{ transform: `translateY(${dragOffset}px)` }"
    @click.self="$emit('close')"
    @close="$emit('close')"
  >
    <!-- The sheet is at most 2/3 of the screen high (dvh = the visible height on a phone),
         so the page above it stays visible and the user sees they can tap next to it.
         Only the list of names scrolls, the title, search field and "Plan delen" stay in place -->
    <div class="flex max-h-[calc(100dvh*2/3)] flex-col px-6 pt-3 pb-7">
      <!-- The top of the sheet can be swiped down to close it.
           touch-none stops the browser from scrolling the page while the user swipes here -->
      <div
        class="touch-none pb-1"
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <!-- The small bar shows that the sheet can be swiped. aria-hidden: screen reader users close with Escape -->
        <div aria-hidden="true" class="mx-auto h-1 w-10 rounded-full bg-grey" />
        <h2 id="share-sheet-title" class="mt-3.5 text-[26px] leading-8 font-semibold text-navy">Deel mijn plan</h2>
        <p class="text-sm leading-5 font-normal text-grey">Met wie wil je dit plan delen?</p>
      </div>

      <div class="mt-5">
        <SearchBar v-model="search" placeholder="Zoek op gebruikersnaam, e-mail of organisatie" />
      </div>

      <h3 class="mt-6 text-sm font-semibold text-navy">Recentelijk gedeeld met</h3>

      <!-- The scroll area: min-h-0 + flex-1 let it shrink to the space that is left, overflow-y-auto makes it scroll.
           The names scroll up to the top of "Plan delen", that is where they are cut off.
           pb-16 keeps space under the last name, so it never sits against the button.
           px-1/-mx-1 and pt-1 give the focus outline of a row room, so the scroll area doesn't cut it off.
           [scrollbar-width:none] hides the scrollbar (swiping and the mouse wheel still work) -->
      <div class="-mx-1 mt-1 min-h-0 flex-1 overflow-y-auto px-1 pt-1 pb-16 [scrollbar-width:none]">
        <ul class="flex flex-col gap-3">
          <li v-for="contact in filteredContacts" :key="contact.id">
            <SharePlanContactRow
              :name="contact.name"
              :organisation="contact.organisation"
              :is-selected="isSelected(contact)"
              @toggle="toggleContact(contact)"
            />
          </li>
        </ul>
        <!-- Shown when the search finds nobody -->
        <p v-if="filteredContacts.length === 0" class="text-sm font-normal text-grey">Geen resultaten gevonden.</p>
      </div>

      <!-- The bottom button, always visible. Grey and disabled until at least one person is chosen -->
      <div class="shrink-0">
        <PrimaryButton label="Plan delen" icon="share" :disabled="!hasSelection" @click="handleShare" />
      </div>
    </div>
  </dialog>
</template>
