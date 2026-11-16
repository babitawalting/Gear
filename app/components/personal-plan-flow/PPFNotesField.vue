<!-- app/components/personal-plan-flow/PPFNotesField.vue
     The "Notities" block: a heading and a large text box where the user can write a note.
     Usage: <PPFNotesField v-model="notes" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // What the user typed. With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, default: "" },
    // The text above the box, in Dutch
    label: { type: String, default: "Notities" },
    // The hint text in the empty box, in Dutch
    placeholder: { type: String, default: "Notitie toevoegen" },
  },
  // Tells the parent that the text changed (this makes v-model work)
  emits: ["update:modelValue"],
  methods: {
    handleInput(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      this.$emit("update:modelValue", textarea.value);
    },
  },
});
</script>

<template>
  <!-- The <label> wraps the text and the box, so screen readers connect them without an id -->
  <label class="flex flex-col gap-2">
    <span class="text-sm leading-5 font-semibold text-navy">{{ label }}</span>
    <!-- h-25 is 100px, like the design. resize-none removes the little handle in the corner -->
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      class="h-25 w-full resize-none rounded-xl border border-sand bg-white p-3 text-xs leading-4 font-normal text-navy placeholder:text-grey focus-visible:outline-2 focus-visible:outline-blue"
      @input="handleInput"
    />
  </label>
</template>
