<!-- app/components/plan-detail/PlanDetailExamBlock.vue
     The content of the "Examens" step: the name of an exam, a short text and three buttons.
     The first two buttons do nothing yet. The third one tells the page that the exam is done (event `completed`).
     Usage: <PlanDetailExamBlock title="Praktijkexamen" text="Het rijbewijs BE vereist een praktijkexamen." @completed="markStepDone" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the exam, in Dutch
    title: { type: String, required: true },
    // What the user needs to know about this exam, in Dutch
    text: { type: String, required: true },
  },
  // Tells the page that the user says this exam is already done
  emits: ["completed"],
});
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-xs leading-4 font-semibold text-navy">{{ title }}</h3>
    <p class="mt-1 text-xs leading-4 font-normal text-grey">{{ text }}</p>

    <!-- The buttons are written here directly with the classes of the skill's button states.
         They are 29px tall like in the design, and use a blue border (the skill's Secondary state has a sand border) -->
    <div class="mt-3 flex flex-col gap-1.5">
      <button
        type="button"
        class="flex h-7.25 w-full items-center justify-center rounded-xl bg-blue px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        Zoek rijschool in de omgeving
      </button>
      <button
        type="button"
        class="flex h-7.25 w-full items-center justify-center rounded-xl border border-blue bg-white px-4 text-xs font-normal text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        Ik heb al een rijschool
      </button>
      <button
        type="button"
        class="flex h-7.25 w-full items-center justify-center rounded-xl border border-blue bg-white px-4 text-xs font-normal text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        @click="$emit('completed')"
      >
        Ik heb dit examen al afgerond
      </button>
    </div>
  </div>
</template>
