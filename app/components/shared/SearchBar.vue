<!-- app/components/shared/SearchBar.vue
     Search field with a magnifying glass, used on several screens.
     Usage: <SearchBar v-model="search" placeholder="Zoek in mijn plannen" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // What the user typed. With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, default: "" },
    // Dutch hint text in the field. It is also the label for screen readers
    placeholder: { type: String, required: true },
  },
  // Tells the parent that the text changed (this makes v-model work)
  emits: ["update:modelValue"],
  methods: {
    handleInput(event: Event) {
      const input = event.target as HTMLInputElement;
      this.$emit("update:modelValue", input.value);
    },
  },
});
</script>

<template>
  <!-- The <label> wraps the input, so screen readers connect them without an id -->
  <label class="relative block">
    <span class="sr-only">{{ placeholder }}</span>
    <IconDisplay
      name="magnifying-glass"
      class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-grey"
    />
    <input
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      class="h-9 w-full rounded-xl border border-sand bg-white pr-4 pl-10 text-sm font-normal text-navy placeholder:text-grey focus-visible:outline-2 focus-visible:outline-blue"
      @input="handleInput"
    >
  </label>
</template>
