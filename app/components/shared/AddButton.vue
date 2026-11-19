<!-- app/components/shared/AddButton.vue
     Round blue button with a plus, used to add something (for example a new plan).
     Usage: <AddButton label="Nieuw plan" @click="startNewPlan" />
     Where the button sits on the screen (for example bottom right) is decided by the page, not here. -->
<script lang="ts">
export default defineComponent({
  props: {
    // Text for screen readers, because the button only shows an icon (Dutch, e.g. "Nieuw plan")
    label: { type: String, required: true },
  },
  // No `emits` needed: a @click on <AddButton> automatically goes to the <button> below
});
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="flex size-14 items-center justify-center rounded-full bg-blue text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
  >
    <IconDisplay name="plus" class="size-5" />
  </button>
</template>
