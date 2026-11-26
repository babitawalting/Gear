<!-- app/components/shared/StepCard.vue
     One step of a plan: a number, a title, a description and an arrow. When it is open, the content of the step shows below.
     A locked step (grey) can be opened, but nothing in it can be done yet, so the page makes its content read-only.
     Under the content of an open step there is always a button to add evidence from the vault ("Bewijs toevoegen uit kluis").
     The card only tells the page it was tapped (event `add-evidence`): the page decides what happens.
     Usage: <StepCard :number="1" title="Wat heb ik al?" description="Rijbewijs B" :is-open="openStep === 1" @toggle="openStep = 1" @add-evidence="addEvidence(1)">
              ...the content of the step...
            </StepCard> -->
<script lang="ts">
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
    // The text on the vault button, in Dutch
    evidenceLabel: { type: String, default: "Bewijs toevoegen uit kluis" },
  },
  // "toggle": the header was tapped (the page then opens or closes this step)
  // "add-evidence": the vault button was tapped
  emits: ["toggle", "add-evidence"],
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

      <!-- Secondary state (not the main action of the step), with a plus in front.
           In a locked step it is the Disabled state: grey and it can't be used yet -->
      <button
        type="button"
        :disabled="isLocked"
        class="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="isLocked ? 'bg-grey text-white' : 'border border-sand bg-white text-blue'"
        @click="$emit('add-evidence')"
      >
        <IconDisplay name="plus" class="size-4" />
        {{ evidenceLabel }}
      </button>
    </div>
  </section>
</template>
