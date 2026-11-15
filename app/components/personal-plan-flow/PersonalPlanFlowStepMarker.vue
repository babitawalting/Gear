<!-- app/components/personal-plan-flow/PersonalPlanFlowStepMarker.vue
     The marker of one step in the vertical progress bar: a circle with a piece of line above and below it.
     Put it left of a step card, in a row. The line stretches with the height of the card.
     - Step done: a blue circle with a white check.
     - Next step to finish: a circle with a blue border and a blue line from the circle to the card.
     - Other steps (locked): a circle with a grey border.
     - The step that is open has a dot in its circle, as an indicator of where the user is: blue for the next step,
       grey for a locked step. Only one step is open at a time, so there is only one dot.
     The line between two steps is blue when the step above it is done, otherwise grey.
     Usage: <PersonalPlanFlowStepMarker :is-done="false" is-next is-open line-above="blue" line-below="grey" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the step is done
    isDone: { type: Boolean, default: false },
    // True for the step that has to be finished next
    isNext: { type: Boolean, default: false },
    // True when the step is open: the circle gets a dot (not for a step that is done: that one has a check)
    isOpen: { type: Boolean, default: false },
    // The piece of line above the circle: "none" (first step), "blue" or "grey"
    lineAbove: { type: String, default: "none" },
    // The piece of line below the circle: "none" (last step), "blue" or "grey"
    lineBelow: { type: String, default: "none" },
  },
  computed: {
    // Classes for a piece of line. "none" keeps the space but draws nothing, so the circle stays in the same place
    aboveClasses(): string {
      return this.lineClasses(this.lineAbove);
    },
    belowClasses(): string {
      return this.lineClasses(this.lineBelow);
    },
    // The border color of the circle when the step is not done
    ringClasses(): string {
      return this.isNext ? "border-blue" : "border-grey";
    },
    // The dot color: blue for the next step, grey for a locked step
    dotClasses(): string {
      return this.isNext ? "bg-blue" : "bg-grey";
    },
    // Only the step that is open has a dot. A done step has a check instead
    showDot(): boolean {
      return !this.isDone && this.isOpen;
    },
    // A text for screen readers, because the circle itself is only a drawing
    statusText(): string {
      if (this.isDone) return "Afgerond";
      return this.isNext ? "Volgende stap" : "Nog niet beschikbaar";
    },
  },
  methods: {
    lineClasses(line: string): string {
      if (line === "blue") return "bg-blue";
      if (line === "grey") return "bg-grey";
      return "bg-transparent";
    },
  },
});
</script>

<template>
  <!-- self-stretch makes the marker as high as the card next to it, so the line below the circle can fill the space -->
  <div class="relative flex w-6 shrink-0 flex-col items-center self-stretch">
    <span class="sr-only">{{ statusText }}</span>
    <!-- 21px is the distance from the top of the card to the top of the circle (the card header is 66px high) -->
    <div class="h-5.25 w-0.5" :class="aboveClasses" />

    <div
      aria-hidden="true"
      class="flex size-6 shrink-0 items-center justify-center rounded-full border-2"
      :class="isDone ? 'border-blue bg-blue' : ['bg-white', ringClasses]"
    >
      <IconDisplay v-if="isDone" name="check" class="size-3.5 text-white" />
      <div v-else-if="showDot" class="size-3 rounded-full" :class="dotClasses" />
    </div>

    <div class="w-0.5 flex-1" :class="belowClasses" />

    <!-- The blue line from the circle to the card, only for the step that has to be finished next -->
    <div v-if="isNext" aria-hidden="true" class="absolute top-8.25 left-full h-0.5 w-4 -translate-y-1/2 bg-blue" />
  </div>
</template>
