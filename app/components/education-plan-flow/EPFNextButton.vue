<!-- app/components/education-plan-flow/EPFNextButton.vue
     The "Volgende" button at the bottom of the education plan flow, as wide as its parent.
     Primary state of the skill (blue, white text). It is grey and disabled while nothing is chosen.
     It does not know where it goes: the page decides what happens when it is tapped.
     Usage: <EPFNextButton :disabled="option === ''" @click="goToNextStep" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True while nothing is chosen yet: the button is grey and can't be used
    disabled: { type: Boolean, default: false },
  },
  // No emits needed: a @click on this component automatically goes to the <button> below
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="disabled ? 'bg-grey' : 'bg-blue'"
    class="flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
  >
    Volgende
  </button>
</template>
