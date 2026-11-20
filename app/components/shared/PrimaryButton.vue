<!-- app/components/shared/PrimaryButton.vue
     The main (blue) button, as wide as its parent, for example "Volgende" or "Plan starten".
     Primary state of the skill (blue, white text). It is grey and disabled while `disabled` is set.
     It does not know where it goes: the page decides what happens when it is tapped.
     Usage: <PrimaryButton label="Volgende" :disabled="option === ''" @click="goToNextStep" />
            <PrimaryButton label="Plan delen" icon="share" @click="sharePlan" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The text on the button, in Dutch
    label: { type: String, required: true },
    // True while the button can't be used yet (for example nothing is chosen): the button is grey
    disabled: { type: Boolean, default: false },
    // Optional icon in front of the text, a name from app/utils/icons.ts. Empty means no icon
    icon: { type: String, default: "" },
  },
  // No emits needed: a @click on this component automatically goes to the <button> below
});
</script>

<template>
  <!-- w-full: as wide as its parent. flex-1: in a row with another button, both share the space -->
  <button
    type="button"
    :disabled="disabled"
    :class="disabled ? 'bg-grey' : 'bg-blue'"
    class="flex min-h-11 w-full flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
  >
    <!-- The icon follows the white text color of the button -->
    <IconDisplay v-if="icon !== ''" :name="icon" class="size-5" />
    {{ label }}
  </button>
</template>
