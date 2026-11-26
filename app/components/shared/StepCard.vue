<!-- app/components/shared/StepCard.vue
     One step of a plan: a number, a title, a description and an arrow. When it is open, the content of the step shows below.
     A locked step (grey) can be opened, but nothing in it can be done yet, so the page makes its content read-only.
     An open step shows, from top to bottom:
     1. the content of the step (the default slot)
     2. the evidence the user added from the vault (`evidence`), each with the pencil to remove it (event `remove-evidence`)
     3. the button "Bewijs toevoegen uit kluis" (event `add-evidence`): the page opens the vault drawer
     4. the "actions" slot, for example the button that concludes the step
     Usage: <StepCard :number="1" title="Wat heb ik al?" description="Documenten uit uw kluis" :is-open="openStep === 1"
              :evidence="[{ id: 'cv', title: 'CV' }]" @toggle="toggle(1)" @add-evidence="openVault(1)" @remove-evidence="removeEvidence(1, $event)">
              ...the content of the step...
              <template #actions>...a button...</template>
            </StepCard> -->
<script lang="ts">
// The shape of one piece of evidence, so TypeScript knows which fields it has
interface StepEvidence {
  id: string;
  title: string;
}

export default defineComponent({
  props: {
    // The number in the square, for example 1
    number: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    // True for a step that can't be done yet: the card turns grey. It can still be opened
    isLocked: { type: Boolean, default: false },
    // True when the content of the step is shown. The page decides which step is open
    isOpen: { type: Boolean, default: false },
    // The documents from the vault that the user added to this step
    evidence: { type: Array as PropType<StepEvidence[]>, default: () => [] },
    // The text on the vault button, in Dutch
    evidenceLabel: { type: String, default: "Bewijs toevoegen uit kluis" },
  },
  // "toggle": the header was tapped (the page then opens or closes this step)
  // "add-evidence": the vault button was tapped
  // "remove-evidence": "Verwijderen" was tapped on a piece of evidence, the value is its id
  emits: ["toggle", "add-evidence", "remove-evidence"],
});
</script>

<template>
  <section class="w-full rounded-xl border border-sand bg-white">
    <!-- The whole header is one button, so it works with the keyboard. aria-expanded tells screen readers if the step is open -->
    <button
      type="button"
      :aria-expanded="isOpen"
      class="flex w-full items-center gap-2.25 rounded-xl py-2.25 pr-4 pl-2.25 text-left focus-visible:outline-2 focus-visible:outline-blue"
      @click="$emit('toggle')"
    >
      <span
        class="flex size-11.5 shrink-0 items-center justify-center rounded-xl text-xl font-normal text-white"
        :class="isLocked ? 'bg-grey' : 'bg-blue'"
      >{{ number }}</span>
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="text-sm leading-5 font-semibold" :class="isLocked ? 'text-grey' : 'text-navy'">{{ title }}</span>
        <!-- truncate: a long description (for example a list of documents) stays on one line and ends with "..." -->
        <span class="truncate text-xs leading-4 font-normal text-grey">{{ description }}</span>
      </span>
      <!-- One arrow pointing right. When the step is open it is turned a quarter (rotate-90) so it points down -->
      <IconDisplay name="chevron-right" class="size-4 shrink-0 text-grey" :class="isOpen ? 'rotate-90' : ''" />
    </button>

    <!-- The content of the step goes here, only when it is open -->
    <div v-if="isOpen" class="pr-4.5 pb-4 pl-7">
      <slot />

      <!-- The evidence the user added from the vault. In a locked step the pencil is hidden, because nothing can change yet -->
      <ul v-if="evidence.length > 0">
        <li v-for="item in evidence" :key="item.id">
          <DocumentRow
            :title="item.title"
            :has-line="evidence.length > 1"
            :can-edit="!isLocked"
            @remove="$emit('remove-evidence', item.id)"
          />
        </li>
      </ul>

      <!-- Secondary state (not the main action of the step), with a plus in front.
           In a locked step it is the Disabled state: grey and it can't be used yet.
           aria-haspopup tells screen readers that the button opens a pop-up (the vault drawer) -->
      <button
        type="button"
        :disabled="isLocked"
        aria-haspopup="dialog"
        class="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="isLocked ? 'bg-grey text-white' : 'border border-sand bg-white text-blue'"
        @click="$emit('add-evidence')"
      >
        <IconDisplay name="plus" class="size-4" />
        {{ evidenceLabel }}
      </button>

      <!-- Room for buttons under the vault button, for example "Volgende stap". Only shown when the page fills it -->
      <slot name="actions" />
    </div>
  </section>
</template>
