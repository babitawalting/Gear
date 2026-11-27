<!-- app/components/plans-overview/new-plan/PlanCategorySheet.vue
     The sheet that slides up from the bottom to choose the category of a new plan.
     It is a native <dialog>: the browser gives us the dark/blurred background, closing with Escape
     and keeping the keyboard focus inside the sheet, so we don't have to build that ourselves.
     Usage: <PlanCategorySheet :open="isSheetOpen" @close="isSheetOpen = false" @start="startPlan" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the sheet is shown. The parent decides when to open and close it
    open: { type: Boolean, default: false },
  },
  // "close": the user cancelled (button, Escape or a click next to the sheet)
  // "start": the user chose a category and pressed "Plan starten", the value is the chosen category
  emits: ["close", "start"],
  data() {
    return {
      // The chosen category: "education", "career" or "personal". Empty means nothing chosen yet
      category: "",
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
    // Opens or closes the real <dialog> so it matches the `open` prop
    syncDialog(isOpen: boolean) {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (isOpen && !dialog.open) {
        this.category = "";
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    },
    handleStart() {
      this.$emit("start", this.category);
    },
  },
});
</script>

<template>
  <!-- The dialog itself has no padding, so a click on `self` can only be a click on the blurred background.
       mx-auto + max-w-[402px]: the sheet is only as wide as the page column (the phone screen), also on a wide window -->
  <dialog
    ref="dialog"
    aria-labelledby="category-sheet-title"
    class="fixed inset-x-0 top-auto bottom-0 mx-auto mb-0 w-full max-w-[402px] rounded-t-3xl border border-b-0 border-sand bg-white p-0 backdrop:bg-white/40 backdrop:backdrop-blur-sm"
    @click.self="$emit('close')"
    @close="$emit('close')"
  >
    <div class="flex flex-col px-6 pt-7.5 pb-7">
      <h2 id="category-sheet-title" class="text-[26px] leading-8 font-semibold text-navy">Categorie</h2>
      <p class="text-sm leading-5 font-normal text-grey">Onder welke categorie valt het nieuwe plan?</p>

      <div role="radiogroup" aria-labelledby="category-sheet-title" class="mt-5.5 flex flex-col gap-4">
        <PlanCategorySheetRow v-model="category" name="category" value="education" label="Educatie" icon="school" />
        <PlanCategorySheetRow v-model="category" name="category" value="career" label="Carrière" icon="industry" />
        <PlanCategorySheetRow v-model="category" name="category" value="personal" label="Persoonlijk" icon="id-card" />
      </div>

      <!-- flex-wrap: when both buttons don't fit next to each other (small phones), the second one goes under the first.
           Both then fill the whole width, because they have flex-1 -->
      <div class="mt-8 flex flex-wrap gap-6">
        <CancelButton label="Annuleren" @click="$emit('close')" />
        <PrimaryButton label="Plan starten" :disabled="category === ''" @click="handleStart" />
      </div>
    </div>
  </dialog>
</template>
