<!-- app/components/shared/EditableTitle.vue
     The top of a page whose title the user may change, like a plan (and later a document in the vault):
     the title and subtext (PageHeader) with the menu button (three dots) next to it.
     Tapping the three dots puts the title in a compact text field (white, sand border), so the user can change it.
     On the right side of the field are a check (save) and a cross (cancel). Enter also saves, Escape also cancels.
     The component does not save anything itself: it sends the new title to the page (event `save`), and the page saves it.
     Usage: <EditableTitle :title="planTitle" subtitle="Sollicitatie" @save="saveTitle" />
            <EditableTitle :title="document.title" subtitle="Document" field-label="Naam van het document" @save="renameDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The current title of the plan, in Dutch
    title: { type: String, required: true },
    // The line under the title, for example "Sollicitatie"
    subtitle: { type: String, required: true },
    // The name of the text field for screen readers, in Dutch. The field has no visible label, because it sits in the place of the title
    fieldLabel: { type: String, default: "Titel van het plan" },
  },
  // "save": the user saved a new title, the value is the new title (without spaces at the start or end)
  emits: ["save"],
  data() {
    return {
      // True while the text field is shown instead of the title
      isEditing: false,
      // What the user typed in the text field. It only becomes the real title after the check is tapped
      draftTitle: "",
    };
  },
  computed: {
    // The check can't be used while the field is empty, because a plan always needs a title
    canSave(): boolean {
      return this.draftTitle.trim() !== "";
    },
  },
  methods: {
    startEditing() {
      this.draftTitle = this.title;
      this.isEditing = true;
      // $nextTick waits until Vue has shown the text field. Then the cursor is put in it, with the text selected
      this.$nextTick(() => {
        const input = this.$refs.titleInput as HTMLInputElement | undefined;
        input?.focus();
        input?.select();
      });
    },
    cancelEditing() {
      this.isEditing = false;
    },
    saveTitle() {
      if (!this.canSave) return;
      this.$emit("save", this.draftTitle.trim());
      this.isEditing = false;
    },
    handleInput(event: Event) {
      this.draftTitle = (event.target as HTMLInputElement).value;
    },
  },
});
</script>

<template>
  <div>
    <!-- Normal view: the title with the three dots next to it -->
    <div v-if="!isEditing" class="flex items-start justify-between gap-4">
      <PageHeader :title="title" :subtitle="subtitle" />
      <!-- The negative margins keep the 44px tappable area from pushing the header -->
      <button
        type="button"
        aria-label="Titel bewerken"
        class="-mt-1 -mr-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-grey focus-visible:outline-2 focus-visible:outline-blue"
        @click="startEditing"
      >
        <IconDisplay name="ellipsis" class="size-5 rotate-90" />
      </button>
    </div>

    <!-- Edit view. A <form> lets the Enter key save (@submit.prevent stops the browser from reloading the page).
         @keydown.esc: the Escape key cancels -->
    <form v-else class="flex flex-col" @submit.prevent="saveTitle" @keydown.esc="cancelEditing">
      <!-- The page keeps its <h1> while editing, only for screen readers (sr-only) -->
      <h1 class="sr-only">{{ title }}</h1>
      <!-- The text field with the two buttons inside it on the right. focus-within: the whole field gets the focus outline
           while the user types. It is a compact field (18px text, 40px high), so it doesn't take over the top of the page -->
      <div class="flex items-center gap-3 rounded-xl border border-sand bg-white py-1 pr-2 pl-3 focus-within:outline-2 focus-within:outline-blue">
        <!-- There is no visible label here: the field sits in the place of the title, so aria-label names it for screen readers -->
        <input
          ref="titleInput"
          type="text"
          :value="draftTitle"
          :aria-label="fieldLabel"
          required
          class="min-w-0 flex-1 bg-transparent text-lg leading-6 font-semibold text-navy outline-none"
          @input="handleInput"
        >
        <!-- Save: a blue check, grey while the field is empty (it can't be used then) -->
        <button
          type="submit"
          aria-label="Titel opslaan"
          :disabled="!canSave"
          class="relative flex size-8 shrink-0 items-center justify-center rounded-xl before:absolute before:-inset-1.5 focus-visible:outline-2 focus-visible:outline-blue"
          :class="canSave ? 'text-blue' : 'text-grey'"
        >
          <!-- The button looks 32px (size-8), but before:-inset-1.5 makes the tappable area 44px (the skill's minimum) -->
          <IconDisplay name="check" class="size-5" />
        </button>
        <!-- Cancel: a grey cross, like the grey text of a Cancel button -->
        <button
          type="button"
          aria-label="Bewerken annuleren"
          class="relative flex size-8 shrink-0 items-center justify-center rounded-xl text-grey before:absolute before:-inset-1.5 focus-visible:outline-2 focus-visible:outline-blue"
          @click="cancelEditing"
        >
          <IconDisplay name="xmark" class="size-5" />
        </button>
      </div>
      <!-- The subtext stays under the field, just like under the title -->
      <p class="mt-1 text-sm leading-5 font-normal text-grey">{{ subtitle }}</p>
    </form>
  </div>
</template>
