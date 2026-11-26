<!-- app/components/shared/SecondaryButton.vue
     The white button with a blue text, for an option that is not the main action, for example "Plan archiveren" next to "Plan delen".
     Secondary state of the skill (white, sand border, blue text). It goes next to a PrimaryButton in a row.
     It does not know where it goes: the page decides what happens when it is tapped.
     Usage: <SecondaryButton label="Plan archiveren" icon="archive" @click="archivePlan" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The text on the button, in Dutch
    label: { type: String, required: true },
    // Optional icon in front of the text, a name from app/utils/icons.ts. Empty means no icon
    icon: { type: String, default: "" },
  },
  // No emits needed: a @click on this component automatically goes to the <button> below
});
</script>

<template>
  <!-- flex-1: in a row with another button, both share the space. whitespace-nowrap keeps the text on one line -->
  <button
    type="button"
    class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal whitespace-nowrap text-blue focus-visible:outline-2 focus-visible:outline-blue"
  >
    <IconDisplay v-if="icon !== ''" :name="icon" class="size-5" />
    {{ label }}
  </button>
</template>
