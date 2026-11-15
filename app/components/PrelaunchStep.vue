<!-- app/components/PrelaunchStep.vue
     First step of every application plan (the card itself is PlanStep.vue): "Wat heb ik al?".
     The user picks documents and items from their vault ("De kluis").
     Names are fixed in the vault, so the user only chooses which ones to use.
     "Kies uit kluis" opens a bottom drawer with the whole vault. Checking an item
     adds it right away (no "Toevoegen" button), so several items can be added quickly.
     The drawer has a "search" slot for the search component that is made later:
     <PrelaunchStep ...><template #search><VaultSearch /></template></PrelaunchStep>

     Usage:
     <PrelaunchStep
       :vault-items="[{ id: 1, name: 'CV' }, { id: 2, name: 'Diploma' }]"
       :initial-selected-ids="[1]"
       @change="(items) => console.log(items)"
     />
-->
<script lang="ts">
import type { PropType } from "vue";

// One document or item from the user's vault
export interface VaultItem {
  id: number;
  name: string;
}

export default defineComponent({
  props: {
    // Step number shown in the blue square, this step is always first
    stepNumber: { type: Number, default: 1 },
    // Everything in the user's vault (later: loaded from the vault)
    vaultItems: {
      type: Array as PropType<VaultItem[]>,
      default: () => [],
    },
    // ids of the vault items that are already in this plan
    initialSelectedIds: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    // Whether the step starts opened
    startOpen: { type: Boolean, default: true },
  },
  // Events this component sends to its parent
  emits: ["change"],
  data() {
    return {
      isVaultOpen: false,
      // Values for dragging the vault drawer down
      isDragging: false,
      dragStartY: 0,
      dragOffset: 0,
      // Copy the prop, so we can change the list without changing the parent's data
      selectedIds: [...this.initialSelectedIds],
      // id of the item whose actions are shown, null = none
      editingId: null as number | null,
    };
  },
  computed: {
    // The chosen vault items, in the order they were chosen
    selectedItems(): VaultItem[] {
      const items: VaultItem[] = [];
      for (const id of this.selectedIds) {
        const item = this.vaultItems.find((vaultItem) => vaultItem.id === id);
        if (item) {
          items.push(item);
        }
      }
      return items;
    },
    // Unique id so aria-controls and aria-labelledby point to the right element
    vaultId(): string {
      return `prelaunch-step-${this.stepNumber}-vault`;
    },
  },
  methods: {
    openVault() {
      this.isVaultOpen = true;
      // $nextTick waits until the drawer is on the screen, then moves keyboard focus into it
      this.$nextTick(() => {
        (this.$refs.closeButton as HTMLButtonElement).focus();
      });
    },
    // Dragging the drawer down: remember where the finger started
    startDrag(event: PointerEvent) {
      this.isDragging = true;
      this.dragStartY = event.clientY;
      // Keep getting move events, even when the finger leaves the drag area
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    },
    moveDrag(event: PointerEvent) {
      if (!this.isDragging) {
        return;
      }
      // Only move down, never up
      this.dragOffset = Math.max(0, event.clientY - this.dragStartY);
    },
    endDrag() {
      if (!this.isDragging) {
        return;
      }
      this.isDragging = false;
      // Dragged far enough: close. Otherwise slide back up.
      if (this.dragOffset > 100) {
        this.closeVault();
      }
      this.dragOffset = 0;
    },
    closeVault() {
      this.isVaultOpen = false;
      // Give focus back to the button that opened the drawer
      this.$nextTick(() => {
        (this.$refs.vaultButton as HTMLButtonElement).focus();
      });
    },
    isSelected(item: VaultItem): boolean {
      return this.selectedIds.includes(item.id);
    },
    // Called by a vault checkbox: add the item, or remove it when it was already added
    toggleItem(item: VaultItem) {
      if (this.isSelected(item)) {
        this.removeItem(item);
      } else {
        this.selectedIds.push(item.id);
        this.emitChange();
      }
    },
    startEditing(item: VaultItem) {
      this.editingId = item.id;
    },
    stopEditing() {
      this.editingId = null;
    },
    removeItem(item: VaultItem) {
      this.selectedIds = this.selectedIds.filter((id) => id !== item.id);
      this.stopEditing();
      this.emitChange();
    },
    // Tell the parent which vault items are in the plan now
    emitChange() {
      this.$emit("change", this.selectedItems);
    },
  },
});
</script>

<template>
  <PlanStep
    :step-number="stepNumber"
    title="Wat heb ik al?"
    subtitle="Documenten uit uw kluis"
    :start-open="startOpen"
  >
    <div>
      <p v-if="selectedItems.length === 0" class="py-3 text-sm">
        Nog geen documenten gekozen.
      </p>

      <!-- The documents that are in this plan -->
      <ul v-else>
        <li
          v-for="item in selectedItems"
          :key="item.id"
          class="border-b border-sand py-2"
        >
          <div class="flex items-center gap-2">
            <span class="flex-1 text-sm font-semibold">{{ item.name }}</span>

            <!-- Edit mode: the remove button appears in the same row, next to the close button -->
            <button
              v-if="editingId === item.id"
              type="button"
              class="min-h-11 shrink-0 rounded-xl border border-red bg-white px-3 text-sm text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              :aria-label="`${item.name} verwijderen uit plan`"
              @click="removeItem(item)"
            >
              Verwijderen
            </button>

            <!-- Normal: blue pen button. Edit mode: grey close button -->
            <!-- One button for both states, so keyboard focus stays on it when it changes -->
            <button
              type="button"
              class="relative flex size-11 shrink-0 items-center justify-center rounded-xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              :class="editingId === item.id ? 'bg-grey' : 'bg-blue'"
              :aria-label="editingId === item.id ? 'Annuleren' : `${item.name} wijzigen`"
              @click="editingId === item.id ? stopEditing() : startEditing(item)"
            >
              <template v-if="editingId === item.id">
                <!-- Cross made with two lines (there is no close icon in the icon set) -->
                <span class="absolute h-0.5 w-4 rotate-45 rounded-xl bg-white" aria-hidden="true" />
                <span class="absolute h-0.5 w-4 -rotate-45 rounded-xl bg-white" aria-hidden="true" />
              </template>
              <AppIcon v-else name="pen-to-square" class="size-5" />
            </button>
          </div>
        </li>
      </ul>

      <!-- Opens the vault drawer -->
      <div class="mt-3 flex justify-end">
        <button
          ref="vaultButton"
          type="button"
          class="flex min-h-11 items-center gap-2 rounded-xl border border-blue bg-white px-4 text-sm text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          aria-haspopup="dialog"
          @click="openVault"
        >
          <AppIcon name="unlock" class="size-4" />
          Kies uit kluis
        </button>
      </div>
    </div>

    <!-- Bottom drawer with the whole vault: check items to add them to the plan -->
    <div
      v-if="isVaultOpen"
      class="fixed inset-0 z-50 flex items-end justify-center"
      @keydown.esc="closeVault"
    >
      <!-- Dark background, tapping it closes the drawer -->
      <div class="absolute inset-0 bg-navy/40" aria-hidden="true" @click="closeVault" />

      <div
        :id="vaultId"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${vaultId}-title`"
        class="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-t-xl bg-white px-4 pb-4 text-navy"
        :class="isDragging ? '' : 'transition-transform'"
        :style="{ transform: `translateY(${dragOffset}px)` }"
      >
        <!-- Drag area: pull this part down to close the drawer.
             touch-none stops the page from scrolling while dragging. -->
        <div
          class="touch-none pt-2"
          @pointerdown="startDrag"
          @pointermove="moveDrag"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        >
          <!-- Small handle bar that shows the drawer can be dragged -->
          <div class="mx-auto h-1 w-10 rounded-xl bg-sand" aria-hidden="true" />

          <div class="flex items-center justify-between gap-3">
            <h2 :id="`${vaultId}-title`" class="text-xl font-semibold">Uw kluis</h2>
            <button
              ref="closeButton"
              type="button"
              class="relative -mr-2 flex size-11 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-blue"
              aria-label="Sluiten"
              @pointerdown.stop
              @click="closeVault"
            >
              <!-- Cross made with two lines (there is no close icon in the icon set) -->
              <span class="absolute h-0.5 w-4 rotate-45 rounded-xl bg-navy" aria-hidden="true" />
              <span class="absolute h-0.5 w-4 -rotate-45 rounded-xl bg-navy" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- Place for the search component, which is made later -->
        <slot name="search" />

        <p v-if="vaultItems.length === 0" class="mt-3 text-sm">
          Uw kluis is nog leeg.
        </p>
        <ul v-else class="mt-3 overflow-y-auto">
          <li v-for="item in vaultItems" :key="item.id" class="border-b border-sand">
            <label
              class="flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-blue"
            >
              <input
                type="checkbox"
                class="size-5 shrink-0 accent-blue"
                :checked="isSelected(item)"
                @change="toggleItem(item)"
              >
              {{ item.name }}
            </label>
          </li>
        </ul>
      </div>
    </div>
  </PlanStep>
</template>
