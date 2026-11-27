<!-- app/components/vault/VaultCategorySheet.vue
     The sheet that slides up from the bottom when the user taps the + on the vault page ("Toevoegen").
     The user chooses the category of the new document and presses "Document toevoegen".
     It works like the category sheet of a new plan (PlanCategorySheet): a native <dialog> that gives us the blurred
     background, closing with Escape and keeping the keyboard focus inside.
     Usage: <VaultCategorySheet :open="isSheetOpen" @close="isSheetOpen = false" @choose="addDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the sheet is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
  },
  // "close": the user cancelled ("Annuleren", Escape or a tap next to the sheet)
  // "choose": the user chose a category and pressed "Document toevoegen", the value is the category, for example "career"
  emits: ["close", "choose"],
  data() {
    return {
      // The chosen category. Empty means nothing chosen yet
      category: "",
      // The categories of the vault with their icons, from app/utils/vaultDocuments.ts
      categories: vaultCategories,
    };
  },
  watch: {
    // Runs every time the `open` prop changes
    open(isOpen: boolean) {
      this.syncDialog(isOpen);
    },
  },
  // mounted() runs once, when the component is on the page. The sheet could already be open then
  mounted() {
    this.syncDialog(this.open);
  },
  methods: {
    // Opens or closes the real <dialog> so it matches the `open` prop. Opening starts without a choice
    syncDialog(isOpen: boolean) {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (isOpen && !dialog.open) {
        this.category = "";
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    },
    handleChoose() {
      this.$emit("choose", this.category);
    },
  },
});
</script>

<template>
  <!-- The dialog itself has no padding, so a click on `self` can only be a click on the blurred background.
       mx-auto + max-w-[402px]: the sheet is only as wide as the page column, like a phone screen -->
  <dialog
    ref="dialog"
    aria-labelledby="vault-category-sheet-title"
    class="fixed inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-[402px] rounded-t-3xl border border-b-0 border-sand bg-white p-0 backdrop:bg-white/40 backdrop:backdrop-blur-sm"
    @click.self="$emit('close')"
    @close="$emit('close')"
  >
    <div class="flex flex-col px-6 pt-7.5 pb-7">
      <h2 id="vault-category-sheet-title" class="text-[26px] leading-8 font-semibold text-navy">Toevoegen</h2>
      <p class="text-sm leading-5 font-normal text-grey">Onder welke categorie valt het nieuwe document?</p>

      <!-- The same rows as in the category sheet of a new plan (shared component) -->
      <div role="radiogroup" aria-labelledby="vault-category-sheet-title" class="mt-5.5 flex flex-col gap-4">
        <PlanCategorySheetRow
          v-for="item in categories"
          :key="item.value"
          v-model="category"
          name="vault-category"
          :value="item.value"
          :label="item.label"
          :icon="item.icon"
        />
      </div>

      <!-- "Document toevoegen" is Disabled (grey) until a category is chosen -->
      <div class="mt-8 flex gap-4">
        <CancelButton label="Annuleren" @click="$emit('close')" />
        <PrimaryButton label="Document toevoegen" :disabled="category === ''" @click="handleChoose" />
      </div>
    </div>
  </dialog>
</template>
