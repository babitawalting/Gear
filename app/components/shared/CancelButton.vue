<!-- app/components/shared/CancelButton.vue
     The white button next to a primary button, for example "Annuleren" (Cancel state of the skill: white, sand border, grey text).
     Usage: <CancelButton label="Annuleren" @click="close" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The text on the button, in Dutch
    label: { type: String, required: true },
  },
  // No emits needed: a @click on this component automatically goes to the <button> below
});
</script>

<template>
  <button
    type="button"
    class="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-grey focus-visible:outline-2 focus-visible:outline-blue"
  >
    {{ label }}
  </button>
</template>
