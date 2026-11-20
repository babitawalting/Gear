<!-- app/components/share-plan/SharePlanContactRow.vue
     One person in the share sheet: a circle with their initials, their name and their organisation.
     Tapping the row chooses the person (it turns blue). Tapping it again un-chooses them.
     Usage: <SharePlanContactRow name="Anna Jansen" organisation="Fontys" :is-selected="isChosen" @toggle="toggleContact" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The full name of the person, for example "Tim van den Berg"
    name: { type: String, required: true },
    // The organisation of the person, shown in the small blue label, for example "Fontys"
    organisation: { type: String, required: true },
    // True when the person is chosen to share the plan with. The sheet decides this
    isSelected: { type: Boolean, default: false },
  },
  // Tells the sheet that the row was tapped (the sheet then chooses or un-chooses this person)
  emits: ["toggle"],
  computed: {
    // The first letter of the first name and of the last word: "Tim van den Berg" gives "TB"
    initials(): string {
      const words = this.name.trim().split(" ");
      const first = words[0] ?? "";
      const last = words.length > 1 ? (words[words.length - 1] ?? "") : "";
      return (first.charAt(0) + last.charAt(0)).toUpperCase();
    },
  },
});
</script>

<template>
  <!-- The <label> wraps everything, so tapping anywhere in the row chooses the person.
       focus-within shows the focus outline on the whole row when the hidden checkbox has keyboard focus.
       relative keeps the hidden checkbox (sr-only is position: absolute) inside this row,
       otherwise it ends up below the sheet and makes the whole sheet scrollable -->
  <label
    class="relative flex min-h-11 w-full items-center gap-4 rounded-xl border px-3 py-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue"
    :class="isSelected ? 'border-blue bg-blue' : 'border-sand bg-white'"
  >
    <!-- A real checkbox, so the keyboard and screen readers just work. sr-only hides it, the blue row shows the choice -->
    <input
      type="checkbox"
      class="sr-only"
      :checked="isSelected"
      @change="$emit('toggle')"
    >

    <!-- The circle with the initials. aria-hidden: screen readers already read the full name next to it -->
    <span
      aria-hidden="true"
      class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      :class="isSelected ? 'bg-white text-blue' : 'bg-blue text-white'"
    >{{ initials }}</span>

    <span class="min-w-0 flex-1 truncate text-sm font-semibold" :class="isSelected ? 'text-white' : 'text-navy'">{{ name }}</span>

    <span
      class="shrink-0 rounded-full px-3 py-0.5 text-[10px] leading-4 font-semibold"
      :class="isSelected ? 'bg-white text-blue' : 'bg-blue text-white'"
    >{{ organisation }}</span>
  </label>
</template>
