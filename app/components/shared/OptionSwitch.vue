<!-- app/components/shared/OptionSwitch.vue
     A switch between two (or more) options next to each other, each with an icon and a text, for example "Overzicht" and "Archief".
     Usage: <OptionSwitch v-model="view" :options="[{ value: 'overview', label: 'Overzicht', icon: 'file-lines' }, ...]" label="Weergave plannen" />
     The page decides what to show for the chosen value. -->
<script lang="ts">
import type { PropType } from "vue";

export default defineComponent({
  props: {
    // The value of the current choice. With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, default: "" },
    // The options: a list of { value, label, icon }. The icon is the name of an icon of IconDisplay
    options: { type: Array as PropType<{ value: string; label: string; icon: string }[]>, required: true },
    // Text for screen readers that says what the switch is for, in Dutch
    label: { type: String, required: true },
  },
  // Tells the parent when the user picks the other option (this makes v-model work)
  emits: ["update:modelValue"],
});
</script>

<template>
  <!-- role="group" with a label tells screen readers these two buttons belong together -->
  <div
    role="group"
    :aria-label="label"
    class="grid grid-cols-2 rounded-xl border border-sand bg-white"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="modelValue === option.value"
      class="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-normal focus-visible:outline-2 focus-visible:outline-blue"
      :class="modelValue === option.value ? 'bg-blue text-white' : 'text-grey'"
      @click="$emit('update:modelValue', option.value)"
    >
      <IconDisplay :name="option.icon" class="size-5.5" />
      {{ option.label }}
    </button>
  </div>
</template>
