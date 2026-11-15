<!-- app/components/plan-detail/PlanDetailPickupBlock.vue
     The content of the "Rijbewijs ophalen" step: a short explanation, two blue buttons that open a website
     (the gemeente of the user and the RDW) and a white button for someone who already has an appointment.
     When the step is locked (`is-read-only`) the text can be read, but the buttons are grey and can't be used yet.
     The white button does nothing yet.
     Usage: <PlanDetailPickupBlock text="..." municipality-url="https://..." rdw-url="https://..." :is-read-only="step2NotDone" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // What the user needs to know about this step, in Dutch
    text: { type: String, required: true },
    // The website of the gemeente of the user (it comes from the account of the user)
    municipalityUrl: { type: String, required: true },
    // The website of the RDW
    rdwUrl: { type: String, required: true },
    // True while the step is locked: readable, but nothing can be done yet
    isReadOnly: { type: Boolean, default: false },
  },
  computed: {
    // The classes of the two website buttons: blue with white text, or grey (Disabled state of the skill) when the step is locked
    filledButtonClasses(): string {
      return this.isReadOnly ? "bg-grey" : "bg-blue";
    },
    // The classes of the white button: blue border and text, or grey when the step is locked
    outlineButtonClasses(): string {
      return this.isReadOnly ? "border-grey text-grey" : "border-blue text-blue";
    },
  },
});
</script>

<template>
  <div class="flex flex-col">
    <p class="text-xs leading-4 font-normal text-grey">{{ text }}</p>

    <!-- The buttons are links, because they go to another website. A link without an href that has
         aria-disabled="true" is not clickable and screen readers say it is not available -->
    <div class="mt-3 flex flex-col gap-1.5">
      <a
        :href="isReadOnly ? undefined : municipalityUrl"
        :aria-disabled="isReadOnly"
        target="_blank"
        rel="noopener"
        class="flex h-7.25 w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="filledButtonClasses"
      >
        Naar de website van uw gemeente
      </a>
      <a
        :href="isReadOnly ? undefined : rdwUrl"
        :aria-disabled="isReadOnly"
        target="_blank"
        rel="noopener"
        class="flex h-7.25 w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="filledButtonClasses"
      >
        Naar de website van de RDW
      </a>
      <!-- The white button (Secondary look): a real button, because it does not go to a website -->
      <button
        type="button"
        :disabled="isReadOnly"
        class="flex h-7.25 w-full items-center justify-center rounded-xl border bg-white px-4 text-xs font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="outlineButtonClasses"
      >
        Ik heb al een afspraak
      </button>
    </div>
  </div>
</template>
