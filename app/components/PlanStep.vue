<!-- app/components/PlanStep.vue
     The card around every step of a plan: a numbered header that opens and closes
     the step. The content of the step goes in the default slot.
     Open step: blue number. Closed step: grey number.

     Usage:
     <PlanStep :step-number="2" title="Vacaturevereisten" subtitle="Zie wat ontbreekt">
       ...content of the step...
     </PlanStep>
-->
<script lang="ts">
export default defineComponent({
  props: {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    // Whether the step starts opened
    startOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      isOpen: this.startOpen,
    };
  },
  computed: {
    // Unique id so aria-controls points to the right element
    contentId(): string {
      return `plan-step-${this.stepNumber}-content`;
    },
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
  },
});
</script>

<template>
  <section class="rounded-xl border border-sand bg-white p-3 text-navy">
    <!-- Header: tap to open or close the step -->
    <h2>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-blue"
        :aria-expanded="isOpen"
        :aria-controls="contentId"
        @click="toggleOpen"
      >
        <span
          class="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl font-normal text-white"
          :class="isOpen ? 'bg-blue' : 'bg-grey'"
        >
          {{ stepNumber }}
        </span>
        <span class="flex flex-1 flex-col">
          <span class="text-base font-semibold">{{ title }}</span>
          <span v-if="subtitle" class="text-sm font-normal">{{ subtitle }}</span>
        </span>
        <!-- Chevron made with two borders (there is no chevron icon in the icon set) -->
        <span
          class="mr-3 size-3 border-b-2 border-r-2 border-navy transition-transform"
          :class="isOpen ? '-translate-y-0.5 rotate-45' : 'rotate-[-45deg]'"
          aria-hidden="true"
        />
      </button>
    </h2>

    <!-- v-show keeps the content on the page while hidden, so nothing that was filled in is lost -->
    <div v-show="isOpen" :id="contentId" class="mt-2">
      <slot />
    </div>
  </section>
</template>
