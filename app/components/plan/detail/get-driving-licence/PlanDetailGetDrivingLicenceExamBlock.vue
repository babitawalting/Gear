<!-- app/components/get-driving-licence/GetDrivingLicenceExamBlock.vue
     The content of the "Examens" step: three buttons.
     The first two buttons do nothing yet. The third one tells the page that the exam is done (event `completed`).
     While the step is locked (`is-read-only`) the buttons are grey and can't be used yet.
     Usage: <GetDrivingLicenceExamBlock :is-read-only="step1NotDone" @completed="markStepDone" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True while the step is locked: readable, but nothing can be done yet
    isReadOnly: { type: Boolean, default: false },
  },
  // Tells the page that the user says this exam is already done
  emits: ["completed"],
  computed: {
    // The first button: blue with white text, or grey (Disabled state of the skill) when the step is locked
    filledButtonClasses(): string {
      return this.isReadOnly ? "bg-grey" : "bg-blue";
    },
    // The two white buttons: blue border and text, or grey when the step is locked
    outlineButtonClasses(): string {
      return this.isReadOnly ? "border-grey text-grey" : "border-blue text-blue";
    },
  },
});
</script>

<template>
  <div class="flex flex-col">
    <!-- The buttons are written here directly with the classes of the skill's button states.
         They are 29px tall like in the design, and use a blue border (the skill's Secondary state has a sand border) -->
    <div class="flex flex-col gap-1.5">
      <button
        type="button"
        :disabled="isReadOnly"
        class="flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="filledButtonClasses"
      >
        Zoek rijschool in de omgeving
      </button>
      <button
        type="button"
        :disabled="isReadOnly"
        class="flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl border bg-white px-4 text-xs font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="outlineButtonClasses"
      >
        Ik heb al een rijschool
      </button>
      <button
        type="button"
        :disabled="isReadOnly"
        class="flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl border bg-white px-4 text-xs font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="outlineButtonClasses"
        @click="$emit('completed')"
      >
        Ik heb dit examen al afgerond
      </button>
    </div>
  </div>
</template>
