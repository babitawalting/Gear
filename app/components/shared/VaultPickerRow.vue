<!-- app/components/shared/VaultPickerRow.vue
     One document in the vault drawer: the category icon, the name and the date, like a row of the vault in the Figma design.
     Tapping the row chooses the document (it turns blue). Tapping it again un-chooses it.
     Usage: <VaultPickerRow title="CV" category="work" date="2026-09-17" :is-selected="isChosen" @toggle="toggleDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the document, in Dutch
    title: { type: String, required: true },
    // The category of the document, it decides the icon (see app/utils/vaultDocuments.ts)
    category: { type: String, required: true },
    // The date the document was added, written as "2026-09-17"
    date: { type: String, required: true },
    // True when the document is chosen. The drawer decides this
    isSelected: { type: Boolean, default: false },
  },
  // Tells the drawer that the row was tapped (the drawer then chooses or un-chooses this document)
  emits: ["toggle"],
  computed: {
    // vaultCategoryIcon and formatVaultDate come from app/utils/vaultDocuments.ts (auto-imported by Nuxt)
    icon(): string {
      return vaultCategoryIcon(this.category);
    },
    formattedDate(): string {
      return formatVaultDate(this.date);
    },
  },
});
</script>

<template>
  <!-- The <label> wraps everything, so tapping anywhere in the row chooses the document.
       focus-within shows the focus outline on the whole row when the hidden checkbox has keyboard focus.
       relative keeps the hidden checkbox (sr-only is position: absolute) inside this row -->
  <label
    class="relative flex min-h-11 w-full items-center gap-3 rounded-xl border p-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue"
    :class="isSelected ? 'border-blue bg-blue' : 'border-sand bg-white'"
  >
    <!-- A real checkbox, so the keyboard and screen readers just work. sr-only hides it, the blue row shows the choice -->
    <input
      type="checkbox"
      class="sr-only"
      :checked="isSelected"
      @change="$emit('toggle')"
    >

    <!-- The category icon in a square: blue with a white icon, or white with a blue icon when chosen -->
    <span
      aria-hidden="true"
      class="flex size-9 shrink-0 items-center justify-center rounded-xl"
      :class="isSelected ? 'bg-white text-blue' : 'bg-blue text-white'"
    >
      <IconDisplay :name="icon" class="size-5" />
    </span>

    <span class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-sm leading-5 font-semibold" :class="isSelected ? 'text-white' : 'text-navy'">{{ title }}</span>
      <span class="text-xs leading-4 font-normal" :class="isSelected ? 'text-white' : 'text-grey'">{{ formattedDate }}</span>
    </span>

    <!-- A check shows which rows are chosen, so the choice is not shown by color alone -->
    <IconDisplay v-if="isSelected" name="check" class="size-5 shrink-0 text-white" />
  </label>
</template>
