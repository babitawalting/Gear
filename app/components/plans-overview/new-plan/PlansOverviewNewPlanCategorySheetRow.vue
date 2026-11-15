<!-- app/components/plans-overview/new-plan/PlansOverviewNewPlanCategorySheetRow.vue
     One choice in the category sheet: a radio circle, the category name and its icon.
     Several rows with the same `name` form one group, and only one can be chosen.
     Usage: <PlansOverviewNewPlanCategorySheetRow v-model="category" name="category" value="education" label="Educatie" icon="school" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The value of the chosen row in the group. With v-model the parent passes this in as `modelValue`
    modelValue: { type: String, default: "" },
    // The value this row stands for, for example "education"
    value: { type: String, required: true },
    // Rows with the same name belong together (this is how radio buttons work)
    name: { type: String, required: true },
    // The text in the row, in Dutch
    label: { type: String, required: true },
    // Icon name from app/utils/icons.ts, shown in the square on the right
    icon: { type: String, required: true },
  },
  // Tells the parent that this row was chosen (this makes v-model work)
  emits: ["update:modelValue"],
  data() {
    return {
      // The Tailwind classes for each of the three looks of a row
      stylesByState: {
        // Nothing is chosen yet
        default: {
          row: "border-sand bg-white",
          radio: "border-blue bg-white",
          text: "text-navy",
          box: "bg-blue",
          icon: "text-white",
        },
        // This row is chosen: it turns blue
        selected: {
          row: "border-blue bg-blue",
          radio: "border-white bg-white inset-ring-3 inset-ring-blue",
          text: "text-white",
          box: "bg-white",
          icon: "text-blue",
        },
        // Another row is chosen: this one turns grey
        other: {
          row: "border-sand bg-white",
          radio: "border-grey bg-white",
          text: "text-grey",
          box: "bg-grey",
          icon: "text-white",
        },
      },
    };
  },
  computed: {
    isSelected(): boolean {
      return this.modelValue === this.value;
    },
    // Which of the three looks this row has right now
    state(): "default" | "selected" | "other" {
      if (this.isSelected) return "selected";
      if (this.modelValue !== "") return "other";
      return "default";
    },
    styles() {
      return this.stylesByState[this.state];
    },
  },
});
</script>

<template>
  <!-- The <label> wraps everything, so tapping anywhere in the row chooses it -->
  <label
    class="flex w-full items-center gap-6 rounded-xl border py-2 pr-2 pl-5"
    :class="styles.row"
  >
    <!-- A real radio input (keyboard and screen readers just work), only the looks are changed -->
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isSelected"
      class="size-4.5 shrink-0 appearance-none rounded-full border-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="[styles.radio, isSelected ? 'focus-visible:outline-white' : 'focus-visible:outline-blue']"
      @change="$emit('update:modelValue', value)"
    >
    <span class="flex-1 text-sm font-normal" :class="styles.text">{{ label }}</span>
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl" :class="styles.box">
      <IconDisplay :name="icon" class="size-5" :class="styles.icon" />
    </span>
  </label>
</template>
