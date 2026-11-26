<!-- app/components/shared/TitleField.vue
     A compact text field to change a title, with a check (save) and a cross (cancel) on the right side.
     Enter also saves, Escape also cancels. When the field appears, the cursor is put in it with the text selected.
     It is used by EditableTitle (the title at the top of a plan) and by the document cards in the vault.
     The field does not save anything itself: it sends the new title to its parent (event `save`).
     Usage: <TitleField :title="planTitle" field-label="Titel van het plan" @save="saveTitle" @cancel="isEditing = false" />
            <TitleField :title="document.title" field-label="Naam van het document" small @save="rename" @cancel="stopEditing" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The current title. The field starts with this text
    title: { type: String, required: true },
    // The name of the text field for screen readers, in Dutch. The field has no visible label, because it sits in the place of the title
    fieldLabel: { type: String, required: true },
    // True for the small look (14px text), for example inside a card. Otherwise the text is 18px
    small: { type: Boolean, default: false },
  },
  // "save": the user saved a new title, the value is the new title (without spaces at the start or end)
  // "cancel": the user cancelled (the cross or Escape)
  emits: ["save", "cancel"],
  data() {
    return {
      // What the user typed. It only becomes the real title after the check is tapped
      draftTitle: this.title,
    };
  },
  computed: {
    // The check can't be used while the field is empty, because there always has to be a title
    canSave(): boolean {
      return this.draftTitle.trim() !== "";
    },
  },
  // mounted() runs when the field appears: the cursor is put in it, with the text selected
  mounted() {
    const input = this.$refs.titleInput as HTMLInputElement;
    input.focus();
    input.select();
  },
  methods: {
    saveTitle() {
      if (!this.canSave) return;
      this.$emit("save", this.draftTitle.trim());
    },
    handleInput(event: Event) {
      this.draftTitle = (event.target as HTMLInputElement).value;
    },
  },
});
</script>

<template>
  <!-- A <form> lets the Enter key save (@submit.prevent stops the browser from reloading the page).
       @keydown.esc: the Escape key cancels. focus-within: the whole field gets the focus outline while the user types -->
  <form
    class="flex items-center gap-3 rounded-xl border border-sand bg-white py-1 pr-2 pl-3 focus-within:outline-2 focus-within:outline-blue"
    @submit.prevent="saveTitle"
    @keydown.esc="$emit('cancel')"
  >
    <!-- There is no visible label here: the field sits in the place of the title, so aria-label names it for screen readers -->
    <input
      ref="titleInput"
      type="text"
      :value="draftTitle"
      :aria-label="fieldLabel"
      required
      class="min-w-0 flex-1 bg-transparent font-semibold text-navy outline-none"
      :class="small ? 'text-sm leading-5' : 'text-lg leading-6'"
      @input="handleInput"
    >
    <!-- Save: a blue check, grey while the field is empty (it can't be used then).
         The button looks 32px (size-8), but before:-inset-1.5 makes the tappable area 44px (the skill's minimum) -->
    <button
      type="submit"
      aria-label="Titel opslaan"
      :disabled="!canSave"
      class="relative flex size-8 shrink-0 items-center justify-center rounded-xl before:absolute before:-inset-1.5 focus-visible:outline-2 focus-visible:outline-blue"
      :class="canSave ? 'text-blue' : 'text-grey'"
    >
      <IconDisplay name="check" class="size-5" />
    </button>
    <!-- Cancel: a grey cross, like the grey text of a Cancel button -->
    <button
      type="button"
      aria-label="Bewerken annuleren"
      class="relative flex size-8 shrink-0 items-center justify-center rounded-xl text-grey before:absolute before:-inset-1.5 focus-visible:outline-2 focus-visible:outline-blue"
      @click="$emit('cancel')"
    >
      <IconDisplay name="xmark" class="size-5" />
    </button>
  </form>
</template>
