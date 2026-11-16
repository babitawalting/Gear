<!-- app/components/personal-plan-flow/PPFFormField.vue
     A form field with a label above it: a text field, or a date field that opens the phone's own date picker.
     With `small` the label and the field are smaller (12px, regular), for use inside a card.
     Usage: <PPFFormField v-model="title" label="Titel" required />
            <PPFFormField v-model="endDate" label="Einddatum" type="date" />
            <PPFFormField v-model="date" label="Datum" type="date" small /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // What the user typed or picked. With v-model the parent passes this in as `modelValue`.
    // For a date field it is written as "2026-11-14" (year-month-day)
    modelValue: { type: String, default: "" },
    // The text above the field, in Dutch
    label: { type: String, required: true },
    // "text" or "date"
    type: { type: String, default: "text" },
    // True for a field that must be filled in: a star is shown after the label
    required: { type: Boolean, default: false },
    // True for the small look: 12px text and a field of 28px high
    small: { type: Boolean, default: false },
  },
  // Tells the parent that the value changed (this makes v-model work)
  emits: ["update:modelValue"],
  computed: {
    // The classes of the label text: the normal look or the small look
    labelClasses(): string {
      return this.small ? "text-xs leading-4 font-normal" : "text-sm leading-5 font-normal";
    },
    // The classes of the field: the normal look or the small look
    inputClasses(): string {
      return this.small ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm";
    },
  },
  methods: {
    handleInput(event: Event) {
      const input = event.target as HTMLInputElement;
      this.$emit("update:modelValue", input.value);
    },
  },
});
</script>

<template>
  <!-- The <label> wraps the text and the input, so screen readers connect them without an id -->
  <label class="flex flex-col gap-1">
    <!-- The star is only for the eyes: screen readers get the real `required` attribute on the input.
         It sits right after the text on the same line, because a line break would make a space -->
    <span class="text-navy" :class="labelClasses">{{ label }}<span v-if="required" aria-hidden="true">*</span></span>
    <input
      :type="type"
      :value="modelValue"
      :required="required"
      class="w-full min-w-0 rounded-xl border border-sand bg-white font-normal text-navy focus-visible:outline-2 focus-visible:outline-blue"
      :class="inputClasses"
      @input="handleInput"
    >
  </label>
</template>
