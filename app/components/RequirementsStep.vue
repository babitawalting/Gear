<!-- app/components/RequirementsStep.vue
     Second step of an application plan: "Vacaturevereisten".
     Shows what the job asks for (files and links). Every requirement must be filled in,
     so the user doesn't miss anything important. The top line shows how many are missing.
     - type "file": "Toevoegen" opens the file picker of the device
     - type "link": "Koppel account" shows a field for a link (for example a GitHub profile)

     Usage:
     <RequirementsStep
       :requirements="[{ id: 1, name: 'Motivatiebrief', type: 'file' }]"
       @change="(values) => console.log(values)"
     />
-->
<script lang="ts">
import type { PropType } from "vue";

// One thing the job asks for
export interface Requirement {
  id: number;
  name: string;
  type: "file" | "link";
}

export default defineComponent({
  props: {
    stepNumber: { type: Number, default: 2 },
    // What the job asks for (later: from the vacancy)
    requirements: {
      type: Array as PropType<Requirement[]>,
      default: () => [],
    },
    startOpen: { type: Boolean, default: false },
  },
  // Events this component sends to its parent
  emits: ["change"],
  data() {
    return {
      // What the user filled in per requirement: { requirementId: file name or link }
      values: {} as Record<number, string>,
      // Requirement whose link field is open, null = none
      linkFormId: null as number | null,
      linkInput: "",
      // Requirement whose remove button is shown, null = none
      editingId: null as number | null,
    };
  },
  computed: {
    missingCount(): number {
      return this.requirements.filter((requirement) => !this.isFilled(requirement)).length;
    },
    // Only allow saving a link that starts with http:// or https://
    isLinkValid(): boolean {
      try {
        const url = new URL(this.linkInput.trim());
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
  },
  methods: {
    isFilled(requirement: Requirement): boolean {
      return Boolean(this.values[requirement.id]);
    },
    // Called when the user picked a file. For now we only keep the file name.
    onFileChosen(requirement: Requirement, event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
        this.values[requirement.id] = file.name;
        this.emitChange();
      }
    },
    openLinkForm(requirement: Requirement) {
      this.linkFormId = requirement.id;
      this.linkInput = this.values[requirement.id] ?? "";
      this.editingId = null;
    },
    closeLinkForm() {
      this.linkFormId = null;
      this.linkInput = "";
    },
    saveLink(requirement: Requirement) {
      if (!this.isLinkValid) {
        return;
      }
      this.values[requirement.id] = this.linkInput.trim();
      this.closeLinkForm();
      this.emitChange();
    },
    startEditing(requirement: Requirement) {
      this.editingId = requirement.id;
    },
    stopEditing() {
      this.editingId = null;
    },
    removeValue(requirement: Requirement) {
      // An empty value counts as "not filled in"
      this.values[requirement.id] = "";
      this.stopEditing();
      this.emitChange();
    },
    // Tell the parent what is filled in now
    emitChange() {
      this.$emit("change", { ...this.values });
    },
  },
});
</script>

<template>
  <PlanStep
    :step-number="stepNumber"
    title="Vacaturevereisten"
    subtitle="Zie wat ontbreekt"
    :start-open="startOpen"
  >
    <p v-if="requirements.length === 0" class="py-3 text-sm">
      Deze vacature heeft geen vereisten.
    </p>

    <template v-else>
      <!-- aria-live: screen readers read this out again when the number changes -->
      <p class="py-2 text-sm" aria-live="polite">
        <template v-if="missingCount > 0">
          Nog <span class="font-semibold">{{ missingCount }} van {{ requirements.length }}</span> verplicht in te vullen
        </template>
        <template v-else>Alle vereisten zijn ingevuld</template>
      </p>

      <ul>
        <li
          v-for="requirement in requirements"
          :key="requirement.id"
          class="border-b border-sand py-2 last:border-b-0"
        >
          <div class="flex items-center gap-2">
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="text-sm font-semibold">{{ requirement.name }}</span>
              <!-- Filled in: show the file name or link. Not filled in: say it is required. -->
              <span v-if="isFilled(requirement)" class="truncate text-sm">
                {{ values[requirement.id] }}
              </span>
              <span v-else class="text-sm">Verplicht</span>
            </span>

            <!-- NOT FILLED IN: add a file or link an account -->
            <template v-if="!isFilled(requirement)">
              <!-- A label that looks like a button opens the hidden file input -->
              <label
                v-if="requirement.type === 'file'"
                class="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-blue px-4 text-sm text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue"
              >
                <!-- Plus made with two lines (there is no plus icon in the icon set) -->
                <span class="relative flex size-3 items-center justify-center" aria-hidden="true">
                  <span class="absolute h-0.5 w-3 rounded-xl bg-white" />
                  <span class="absolute h-3 w-0.5 rounded-xl bg-white" />
                </span>
                Toevoegen
                <input
                  type="file"
                  class="sr-only"
                  :aria-label="`${requirement.name} toevoegen`"
                  @change="onFileChosen(requirement, $event)"
                >
              </label>

              <button
                v-else-if="linkFormId !== requirement.id"
                type="button"
                class="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-blue px-4 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                :aria-label="`${requirement.name} koppelen`"
                @click="openLinkForm(requirement)"
              >
                <span class="relative flex size-3 items-center justify-center" aria-hidden="true">
                  <span class="absolute h-0.5 w-3 rounded-xl bg-white" />
                  <span class="absolute h-3 w-0.5 rounded-xl bg-white" />
                </span>
                Koppel account
              </button>
            </template>

            <!-- FILLED IN: same edit pattern as step 1 (pen, then remove + cross) -->
            <template v-else>
              <button
                v-if="editingId === requirement.id"
                type="button"
                class="min-h-11 shrink-0 rounded-xl border border-red bg-white px-3 text-sm text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                :aria-label="`${requirement.name} verwijderen`"
                @click="removeValue(requirement)"
              >
                Verwijderen
              </button>
              <button
                type="button"
                class="relative flex size-11 shrink-0 items-center justify-center rounded-xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                :class="editingId === requirement.id ? 'bg-grey' : 'bg-blue'"
                :aria-label="editingId === requirement.id ? 'Annuleren' : `${requirement.name} wijzigen`"
                @click="editingId === requirement.id ? stopEditing() : startEditing(requirement)"
              >
                <template v-if="editingId === requirement.id">
                  <span class="absolute h-0.5 w-4 rotate-45 rounded-xl bg-white" aria-hidden="true" />
                  <span class="absolute h-0.5 w-4 -rotate-45 rounded-xl bg-white" aria-hidden="true" />
                </template>
                <AppIcon v-else name="pen-to-square" class="size-5" />
              </button>
            </template>
          </div>

          <!-- Field for a link, shown after tapping "Koppel account" -->
          <form
            v-if="linkFormId === requirement.id"
            class="mt-2 flex flex-col gap-2"
            @submit.prevent="saveLink(requirement)"
          >
            <label :for="`link-${requirement.id}`" class="text-sm">
              Link naar uw {{ requirement.name }}
            </label>
            <input
              :id="`link-${requirement.id}`"
              v-model="linkInput"
              type="url"
              inputmode="url"
              placeholder="https://"
              :aria-describedby="`link-hint-${requirement.id}`"
              class="min-h-11 rounded-xl border border-sand bg-white px-3 text-sm text-navy focus-visible:outline-2 focus-visible:outline-blue"
            >
            <p :id="`link-hint-${requirement.id}`" class="text-sm">
              Begin met https://
            </p>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="min-h-11 rounded-xl bg-grey px-4 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                @click="closeLinkForm"
              >
                Annuleren
              </button>
              <button
                type="submit"
                class="min-h-11 rounded-xl bg-blue px-4 text-sm text-white disabled:bg-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                :disabled="!isLinkValid"
              >
                Opslaan
              </button>
            </div>
          </form>
        </li>
      </ul>
    </template>
  </PlanStep>
</template>
