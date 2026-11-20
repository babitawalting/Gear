<!-- app/components/shared/OptionCard.vue
     One option the user can choose in a list: a radio circle, a title and an optional short description.
     Several cards with the same `name` form one group, and only one can be chosen.
     Usage: <OptionCard v-model="option" name="option" value="template" title="Template" description="Template subtekst" />
            <OptionCard v-model="option" name="option" value="template" title="Template" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The value of the chosen card in the group. With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, default: "" },
    // The value this card stands for, for example "template"
    value: { type: String, required: true },
    // Cards with the same name belong together (this is how radio buttons work)
    name: { type: String, required: true },
    // The name of the option, in Dutch
    title: { type: String, required: true },
    // The line under the title, in Dutch. Empty means no line: then only the title is shown
    description: { type: String, default: "" },
  },
  // Tells the parent that this card was chosen (this makes v-model work)
  emits: ["update:modelValue"],
  computed: {
    isSelected(): boolean {
      return this.modelValue === this.value;
    },
    // True when another card of the group is chosen: this card turns grey
    isOtherSelected(): boolean {
      return this.modelValue !== "" && !this.isSelected;
    },
  },
});
</script>

<template>
  <!-- The <label> wraps everything, so tapping anywhere in the card chooses it.
       Chosen: blue card with white text. Another card chosen: grey text and ring. Nothing chosen: navy text and blue ring -->
  <label
    class="flex w-full items-center min-h-16 gap-6 rounded-xl border px-6 py-2"
    :class="isSelected ? 'border-blue bg-blue' : 'border-sand bg-white'"
  >
    <!-- A real radio input (keyboard and screen readers just work), only the looks are changed -->
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isSelected"
      class="size-5.5 shrink-0 appearance-none rounded-full border-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="
        isSelected
          ? 'border-white bg-white inset-ring-4 inset-ring-blue focus-visible:outline-white'
          : isOtherSelected
            ? 'border-grey bg-white focus-visible:outline-blue'
            : 'border-blue bg-white focus-visible:outline-blue'
      "
      @change="$emit('update:modelValue', value)"
    >
    <span class="flex min-w-0 flex-1 flex-col">
      <span
        class="text-sm leading-5 font-semibold"
        :class="isSelected ? 'text-white' : isOtherSelected ? 'text-grey' : 'text-navy'"
      >{{ title }}</span>
      <span v-if="description !== ''" class="text-xs leading-4 font-normal" :class="isSelected ? 'text-white' : 'text-grey'">{{ description }}</span>
    </span>
  </label>
</template>
